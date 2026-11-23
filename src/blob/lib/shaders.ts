export const vertexShader = `
attribute vec2 aPos;
void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Ray-marched signed distance blob. The surface is a sphere whose radius
// is displaced along each direction by flowing noise shaped by the sound,
// a tentacle reaching toward the pointer, and a handful of slowly relaxing
// "dents" left behind by earlier gestures. In silence it's a still sphere.
export const fragmentShader = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
// Clock for the surface's flow; it only runs while there's sound.
uniform float uFlow;
uniform vec3 uCenter;
uniform vec3 uStretch;
uniform vec4 uPull;
uniform vec4 uDents[4];
uniform float uRough;
uniform float uEnergy;
uniform vec2 uLight;
// Live analysis of the synth's output: low, mid and high band levels and
// the spectral centroid (0 dark .. 1 bright), all 0..1.
uniform vec4 uBands;
// The same low, mid and high levels scaled so a full sound is about 1,
// which shape the surface at large, medium and fine scales.
uniform vec3 uShape;

const vec3 NAVY = vec3(0.039, 0.098, 0.188);
const vec3 YELLOW = vec3(0.918, 0.690, 0.102);
const vec3 SKY = vec3(0.525, 0.733, 0.847);
const vec3 RED = vec3(0.639, 0.086, 0.129);
const float CAM_Z = 6.0;
const float FOCAL = 1.8;

// Ashima / Stefan Gustavson 3D simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Sharp outward spikes, 0..1. Ridged noise has a crease along each zero
// crossing; multiplying two such fields and raising the result to a power
// leaves points where their crests cross, with flat ground in between.
float spikes(vec3 p) {
    float a = 1.0 - abs(snoise(p));
    float b = 1.0 - abs(snoise(p * 1.3 + 17.0));
    return pow(a * b, 4.0);
}

// How far each band's noise layer displaces the surface.
float lowAmp() { return uRough * 1.4 * uShape.x; }
float midAmp() { return uRough * 1.6 * uShape.y; }
float highAmp() { return uRough * 0.7 * uShape.z; }

float dents() {
    return uDents[0].w + uDents[1].w + uDents[2].w + uDents[3].w;
}

// Steep displacements break the distance bound, so the march takes steps
// this many times smaller: first for the smooth body alone, then with the
// spikes on it.
float bodyLipschitz() {
    return 1.0 + 2.2 * uPull.w + 1.5 * dents() + 1.2 * lowAmp();
}
float lipschitz() {
    return bodyLipschitz() + 6.0 * midAmp() + 14.0 * highAmp();
}

// Radial extent of the smooth body for a unit direction n. The flow warp
// is passed out for the spikes to share.
float body(vec3 n, out vec3 warp) {
    float t = uFlow;
    float r = 1.0 + 0.05 * uShape.x * sin(t * 0.6);
    warp = vec3(0.0);
    // In silence the noise has no effect, so don't pay for it: without a
    // GPU this is most of the cost of a frame.
    if (lowAmp() + midAmp() + highAmp() > 1e-4) {
        // domain-warped noise so the surface slowly flows rather than wobbles
        warp = vec3(
            snoise(n * 0.5 + vec3(0.0, t * 0.05, 0.0)),
            snoise(n * 0.5 + vec3(5.2, 0.0, t * 0.04)),
            0.0
        );
        // bass swells and breathes the whole body
        r += lowAmp() * snoise(n * 0.75 + 0.4 * warp + vec3(t * 0.05, -t * 0.07, t * 0.04));
    }

    r += uPull.w * pow(max(dot(n, uPull.xyz), 0.0), 12.0);
    for (int i = 0; i < 4; i++) {
        r += uDents[i].w * pow(max(dot(n, uDents[i].xyz), 0.0), 4.0);
    }
    return r;
}

// How far the spikes stand out from the body, 0..midAmp() + highAmp():
// mids push out spikes and treble bristles the skin with finer ones.
float spikeLayers(vec3 n, vec3 warp) {
    float t = uFlow;
    return midAmp() * spikes(n * 1.6 - 0.5 * warp + t * 0.09)
        + highAmp() * spikes(n * 4.5 + 0.3 * warp + vec3(-t * 0.3, t * 0.25, t * 0.2));
}

// Scaled distance to step along a ray. Also gives the distance from the
// smooth body, which the glow follows.
float map(vec3 p, out float fromBody) {
    vec3 q = p - uCenter;
    // stretch along the direction of travel, thinning slightly across it
    float sl = length(uStretch);
    if (sl > 1e-4) {
        vec3 sd = uStretch / sl;
        float along = dot(q, sd);
        vec3 across = q - sd * along;
        q = sd * along / (1.0 + sl) + across * (1.0 + sl * 0.35);
    }
    float r = length(q);
    vec3 n = q / max(r, 1e-4);
    vec3 warp;
    fromBody = r - body(n, warp);
    // spikes only stand outward, so until within reach of their tips step
    // as for the smooth body and skip working them out
    float clear = fromBody - midAmp() - highAmp();
    if (clear > 0.05 || midAmp() + highAmp() < 1e-4) {
        return clear * 0.8 / bodyLipschitz();
    }
    return (fromBody - spikeLayers(n, warp)) * 0.8 / lipschitz();
}

float map(vec3 p) {
    float fromBody;
    return map(p, fromBody);
}

vec3 calcNormal(vec3 p) {
    const vec2 k = vec2(1.0, -1.0) * 0.0015;
    return normalize(
        k.xyy * map(p + k.xyy) +
        k.yyx * map(p + k.yyx) +
        k.yxy * map(p + k.yxy) +
        k.xxx * map(p + k.xxx));
}

vec3 background(vec2 uv, vec3 rd) {
    vec3 col = NAVY * (1.0 - 0.35 * dot(uv, uv));
    // faint warm haze behind the blob
    vec2 c = uCenter.xy * (FOCAL / CAM_Z);
    col += YELLOW * 0.07 * exp(-2.2 * length(uv - c));
    col += SKY * 0.04 * smoothstep(0.2, 1.0, rd.y);
    return col;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    vec3 ro = vec3(0.0, 0.0, CAM_Z);
    vec3 rd = normalize(vec3(uv, -FOCAL));

    vec3 col = background(uv, rd);

    // bound the march with a sphere that contains every possible deformation
    float bound = (1.0 + 1.5 * (lowAmp() + midAmp() + highAmp())
        + max(uPull.w, 0.0) + 0.9) * (1.0 + length(uStretch));
    vec3 oc = ro - uCenter;
    float b = dot(oc, rd);
    float h = b * b - dot(oc, oc) + bound * bound;

    // the brighter the sound, the warmer the light
    vec3 tone = mix(SKY, YELLOW, smoothstep(0.25, 0.75, uBands.w));
    float level = (uBands.x + uBands.y + uBands.z) / 3.0;

    float glow = 0.0;
    if (h > 0.0) {
        h = sqrt(h);
        float t = max(-b - h, 0.0);
        float tEnd = -b + h;
        float minD = 1e3;
        bool hit = false;
        float d = 1.0;
        float fromBody;
        for (int i = 0; i < 160; i++) {
            d = map(ro + rd * t, fromBody);
            minD = min(minD, fromBody);
            if (d < 0.001) { hit = true; break; }
            t += d;
            if (t > tEnd) break;
        }
        // grazing rays can run out of steps just short of the surface
        if (!hit && t < tEnd && d < 0.02) hit = true;
        // fade out toward the bounding sphere's edge so it never shows as a ring
        glow = exp(-max(minD, 0.0) * 7.0) * smoothstep(0.0, 1.0, h);

        if (hit) {
            vec3 p = ro + rd * t;
            vec3 n = calcNormal(p);
            vec3 v = -rd;
            vec3 l = normalize(vec3(uLight, 2.5) - p);
            float ndv = max(dot(n, v), 0.0);
            float fres = pow(1.0 - ndv, 3.0);

            // soft wrapped diffuse reads as something gelatinous
            float wrap = max((dot(n, l) + 0.6) / 1.6, 0.0);
            float spec = pow(max(dot(reflect(-l, n), v), 0.0), 48.0);
            float spec2 = pow(max(dot(reflect(-normalize(vec3(-2.0, 3.0, 2.0)), n), v), 0.0), 18.0);

            // thin-film style iridescence that drifts over time; the
            // spectral centroid shifts its hues and treble makes it shimmer
            vec3 irid = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67)
                + fres * 0.9 + dot(n, vec3(0.3, 0.5, 0.2)) * 0.4 + uFlow * 0.02
                + uBands.w * 0.6));

            // bass warms the shadowed core toward red, mids light the
            // body from deep blue toward the sound's tone
            vec3 core = mix(vec3(0.03, 0.10, 0.28), RED * 0.75, smoothstep(0.2, 0.8, uBands.x) * 0.7);
            vec3 lit = mix(SKY * 0.9, tone, smoothstep(0.15, 0.7, uBands.y) * 0.45);
            vec3 body = mix(core, lit, wrap * wrap);
            body = mix(body, RED * 0.8, smoothstep(0.4, 1.0, -n.y) * 0.35);
            vec3 c = body * (0.35 + 0.65 * wrap);
            c += irid * (0.08 + fres * (0.6 + 0.8 * uBands.z));
            c += YELLOW * spec * (0.8 + uEnergy);
            c += SKY * spec2 * 0.25;
            // inner glow that breathes with the music
            c += tone * pow(ndv, 3.0) * (0.06 * uEnergy + 0.15 * level);
            // reflect the room
            c += background(uv, reflect(rd, n)) * 0.6 * fres;

            col = c;
        }
        else {
            col += tone * glow * (0.1 + 0.25 * uEnergy + 0.5 * level);
        }
    }

    // gentle tone curve and film grain to avoid banding on the dark gradient
    col = col / (1.0 + col * 0.35);
    col = pow(col, vec3(0.92));
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uTime) * 43758.5453);
    col += (grain - 0.5) / 255.0;

    gl_FragColor = vec4(col, 1.0);
}
`;
