export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  tags: string[];
  body: string[];
  links?: ProjectLink[];
};

export type Composition = {
  title: string;
  year: number;
  description: string;
  scoreUrl?: string;
};

const IMG = "https://vitruviandan.wordpress.com/wp-content/uploads";

export const projects: Project[] = [
  {
    slug: "beethoven-was-wrong",
    title: "Beethoven Was Wrong",
    excerpt: "A radio programme featuring living composers at UK universities, broadcast on Resonance FM.",
    image: `${IMG}/2015/08/beet-e1448200394853.png`,
    tags: ["Radio", "Resonance FM", "New Music", "Composers", "Goldsmiths", "Bangor", "Cardiff", "City", "Durham", "Edinburgh", "University"],
    body: [
      "Beethoven Was Wrong (BWW) is a radio programme featuring living composers at UK universities. Each week the show visits a different music department, showcasing compositions by faculty and students to build a picture of the musical landscape of British academic institutions. It aired on Resonance FM during the summer of 2015.",
      "John Cage's provocation frames the show's conceptual starting point: “With Beethoven the parts of a composition were defined by means of harmony. With Satie … they were defined by means of time-lengths … Beethoven was in error, and his influence … has been deadening to the art of music.”",
      "The title is provocative, but the show doesn't actually endorse Cage's critique — rather it explores how contemporary composers navigate an era of unprecedented access to historical and global musical traditions.",
      "Created and presented by Daniel James Ross, then a lecturer at Morley College and a PhD candidate in music composition at Goldsmiths.",
    ],
    links: [
      { label: "Full episodes & website", url: "https://bwwradio.wordpress.com" },
      { label: "Morley College", url: "https://www.morleycollege.ac.uk" },
      { label: "Goldsmiths Music", url: "https://www.gold.ac.uk/music/" },
    ],
  },
  {
    slug: "the-engine-room",
    title: "The Engine Room",
    excerpt: "Finalist, The Engine Room International Sound Art Competition 2015, with Jake Stoddart.",
    image: `${IMG}/2015/08/er1.png`,
    tags: ["Electronics", "Max MSP", "Trumpet", "Roddart", "Jake Stoddart"],
    body: [
      "Daniel James Ross reached the finals of The Engine Room International Sound Art Competition in 2015 with a collaborative piece titled “I Remember”, combining trumpet, prepared piano, objects, voice, and live electronics, created with Jake Stoddart.",
      "The competition was judged by Camilo Salazar, Mira Calix, and Simon Emmerson. The piece was exhibited at Morley Gallery from 12 May – 12 June 2015 alongside the other finalists and winners.",
      "A follow-up symposium in July included lectures, workshops and a concert, at which the piece was reimagined live with Tom Jackson on tenor saxophone.",
    ],
    links: [
      { label: "“I Remember” on SoundCloud", url: "https://soundcloud.com/daniel-james-ross/roddart-i-remember" },
      { label: "The Engine Room", url: "https://engineroomlondon.org/pages/exhibition/" },
    ],
  },
  {
    slug: "roddart",
    title: "Roddart",
    excerpt: "Electro-instrumental duo with Jake Stoddart on trumpet and Daniel James Ross on live electronics.",
    image: `${IMG}/2015/11/mad-roddart-text.jpg`,
    tags: ["Jake Stoddart", "Max MSP", "The Engine Room", "Towards the Margins", "Trumpet"],
    body: [
      "Roddart is a duo of Jake Stoddart on trumpet and Daniel James Ross on live electronics, formed in January 2015. Jake plays the trumpet; Daniel doesn't have a criminal record.",
      "The partnership has racked up a competition final, a string of live performances, and a podcast feature.",
      "Recordings and works: “Chubby Fingers” (live at Morley College, 2016), “Chubby Fingers” (2016), “Explode” (2016), “I Remember” (2015), and “Towards the Margins” (2015).",
    ],
    links: [
      { label: "Towards the Margins — improvisation podcast", url: "http://shaunblezard.com/odd7/towards-the-margins/" },
    ],
  },
  {
    slug: "morley-college",
    title: "Morley College",
    excerpt: "Lecturing in radio production, live sound engineering, Max, and Arduino since 2014.",
    image: `${IMG}/2015/11/morley1.jpg`,
    tags: ["Arduino", "Live Sound", "Max MSP", "Radio", "Teaching"],
    body: [
      "Daniel James Ross has been lecturing at Morley College, London, since September 2014 — a further education college for adults.",
      "Courses taught include Radio Production, Live Sound Engineering, Max 7, and Arduino.",
      "“Fantastic teachers and equipment, with a wonderful, friendly atmosphere” — prospective students are invited to explore the college's offerings and join its supportive and fun environment.",
    ],
    links: [
      { label: "Morley College", url: "https://www.morleycollege.ac.uk" },
    ],
  },
  {
    slug: "some-some-unicorn",
    title: "Some Some Unicorn",
    excerpt: "A large collective of like-minded musical magpies, coordinated by Shaun Blezard.",
    image: `${IMG}/2015/11/ssu.png`,
    tags: ["Improvisation", "Shaun Blezard"],
    body: [
      "SSU is a large ensemble of musically-aligned performers coordinated by composer and improviser Shaun Blezard, drawing members from groups including Hugs Bison, Breathing Space, Pere Ubu, Beats and Pieces Big Band, Roddart, Ripsaw Catfish, Wire Assembly, Inclusion Principle, and World of Fox.",
      "Daniel James Ross's debut performance with the ensemble was on 17 November 2015 at The Fiddler's Elbow, recorded for a planned live album release on Bandcamp.",
      "The group improvises around loose ideas from Shaun to create a big band free drone soundscape, drawing comparisons to Godspeed You! Black Emperor and The Kilimanjaro Death Jazz Ensemble, with aesthetic nods to later-era Talk Talk. Community — musically and politically — is a core principle.",
    ],
    links: [
      { label: "Some Some Unicorn", url: "http://shaunblezard.com/somesomeunicorn/" },
      { label: "The Fiddler's Elbow", url: "http://www.thefiddlerselbow.co.uk/" },
    ],
  },
  {
    slug: "classwar-karaoke",
    title: "Classwar Karaoke",
    excerpt: "A random pairing of musicians for the Survey 0032 release, with bassist Noel Walsh.",
    image: `${IMG}/2015/11/cwk.jpg`,
    tags: ["Collaboration", "Improvisation", "Max", "Anthony Donovan", "Noel Walsh"],
    body: [
      "Daniel James Ross's contribution to the Classwar Karaoke release “Survey 0032”, after meeting organiser Anthony Donovan in September 2015 and being invited to perform at a Classwar event despite never having played live for him before.",
      "The project pairs musicians at random. Daniel was matched with Noel Walsh, a bassist and composer from Liverpool, who provided musical stems processed through Daniel's improvising Max patch. The result, “The Ides of Eleven Fifteen”, was released as part of the compilation.",
    ],
    links: [
      { label: "Classwar Karaoke", url: "http://www.classwarkaraoke.com/" },
      { label: "Survey 0032", url: "http://freemusicarchive.org/music/Classwar_Karaoke/Classwar_Karaoke_-_0032_Survey/" },
      { label: "Anthony Donovan", url: "http://freemusicarchive.org/music/Anthony_Donovan/" },
    ],
  },
  {
    slug: "noizemaschin",
    title: "NoizeMaschin",
    excerpt: "Live sound improvisation nights, co-organised from March 2015, released on Bandcamp.",
    image: `${IMG}/2015/12/noizemaschin1.jpg`,
    tags: ["Amersham Arms", "Improvisation", "Live Sound", "Max MSP", "New Music"],
    body: [
      "Daniel James Ross co-organised NoizeMaschin!! from March 2015. All three of the Noizemaschin!! gigs he played in November, December and January at the Amersham Arms in New Cross have been released on Bandcamp — featuring his live set plus a lot more music.",
      "With thanks to fellow collaborators Sam Gillies and Jeremiah O'Spealain.",
    ],
    links: [
      { label: "NoizeMaschin", url: "http://www.noizemaschin.com" },
      { label: "Bandcamp release", url: "https://theartifactory.bandcamp.com/album/noizemaschin-london-1" },
      { label: "Facebook group", url: "https://www.facebook.com/groups/noizemaschinlondon/" },
      { label: "Sam Gillies", url: "http://www.samgillies.com/" },
      { label: "Jeremiah O'Spealain", url: "https://krawwl.bandcamp.com/" },
    ],
  },
  {
    slug: "seem-london",
    title: "SEEM London",
    excerpt: "South-East Experimental Music — a cooperative of South-East London's experimental music events.",
    image: `${IMG}/2016/03/seem-header-2.png`,
    tags: ["EAVI", "experimental music", "Music", "Noizemaschin!!", "Sonic Imperfections"],
    body: [
      "SEEM (South-East Experimental Music) London is a new cooperative initiative bringing together some of South-East London's regular experimental music events, operating as a not-for-profit dedicated to expanding audiences for avant-garde music.",
      "The site offers upcoming gig listings for South-East London and a newsletter for consolidated experimental music updates.",
      "Member organisations: EAVI, Linear Obsessional, The Lumen Lake, Noizemaschin!!, Sonic Imperfections, and The Surround.",
    ],
    links: [
      { label: "SEEM London", url: "http://seemlondon.wordpress.com" },
      { label: "EAVI", url: "http://eavi.goldsmithsdigital.com/" },
      { label: "Linear Obsessional", url: "http://www.linearobsessional.org/" },
      { label: "The Lumen Lake", url: "http://thelumenlake.org.uk" },
      { label: "Noizemaschin!!", url: "http://www.noizemaschin.com/" },
      { label: "The Surround", url: "http://www.thesurround.co.uk/" },
    ],
  },
  {
    slug: "ghosts-of-paradise-yard",
    title: "Ghosts of Paradise Yard",
    excerpt: "A sound art triptych installed at IKLECTIK Art Lab, September 2016.",
    image: `${IMG}/2016/09/workshop-banner.jpg`,
    tags: ["Algorithmic Composition", "i'klectik", "sound art", "sound yard"],
    body: [
      "A sound art triptych spanning three locations — Holy Trinity School, Kagyu Samye Dzong, and Art Lab — installed as part of Sound Yard at IKLECTIK Art Lab, Old Paradise Yard, 20 Carlisle Lane, London SE1 7LG, 8–17 September 2016.",
    ],
    links: [
      { label: "Read more", url: "https://vitruviandan.wordpress.com/2016/09/08/ghosts-of-paradise-yard/" },
      { label: "IKLECTIK Art Lab", url: "http://iklectikartlab.com/" },
    ],
  },
  {
    slug: "bpp-soundwalk",
    title: "Beckenham Place Park Soundwalk",
    excerpt: "An interactive, GPS-triggered soundwalk app built from residents' sonic memories of the park.",
    image: `${IMG}/2018/02/google-play-feature-01.png`,
    tags: ["Beckenham Place Park", "Music", "Soundwalk"],
    body: [
      "Created as part of Soundlab, the Beckenham Place Park Soundwalk app features nine sonic memories of the park, drawn from narratives collected from local residents.",
      "The app plays audio triggered by GPS location as walkers move through marked stages of the park, with manual controls as a backup, plus help, credits, and instructional audio. Free to download on iOS and Android.",
      "Two volunteer workshops were held at The Mansion (1–8 July 2017): the first introduced field recording techniques, the second had participants interview community members about their experiences of the park.",
    ],
    links: [
      { label: "App Store", url: "https://itunes.apple.com/us/app/bpp-soundwalk/id1268630589" },
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=org.bpp.sound.walk" },
      { label: "Project website", url: "http://www.bppsoundwalk.org/" },
    ],
  },
  {
    slug: "github",
    title: "Github",
    excerpt: "All of Daniel's publicly available code, including the slippery chicken project.",
    image: `${IMG}/2015/12/screen-shot-2015-12-04-at-14-11-37.png`,
    tags: ["code", "Music", "slippery chicken"],
    body: [
      "Here's a link to all the code I have made publicly available. It is yours to do with whatever you want.",
    ],
    links: [{ label: "github.com/danieljamesross", url: "https://github.com/danieljamesross/" }],
  },
  {
    slug: "panglitch",
    title: "Panglitch",
    excerpt: "Handpan and glitch electronics, live at the Horniman Museum, November 2019.",
    image: `${IMG}/2020/02/horniman-pic-3.jpeg`,
    tags: ["Improvisation", "Live Sound"],
    body: [
      "Percussionist virtuoso Rosie Bergonzi plays the handpan and Daniel James Ross tries to make it sound less nice with glitchy electronics.",
      "Recorded live at “Sounds from the Garden” as part of the Being Human Festival, Horniman Museum, 17 November 2019.",
    ],
    links: [
      { label: "Bandcamp release", url: "https://divacontemporary.bandcamp.com/album/sounds-from-the-garden-bandstand" },
      { label: "Event information", url: "https://www.horniman.ac.uk/visit/events/sounds-from-the-gardens-being-human-festival" },
    ],
  },
  {
    slug: "giant-leap",
    title: "Giant Leap",
    excerpt: "An algorithmically generated graphic score for the 50th anniversary of the Moon Landing.",
    image: `${IMG}/2020/02/dm312-moon-transparent_ring.png`,
    tags: ["Algorithmic Composition"],
    body: [
      "Algorithmically generated graphic score piece for mixed improvising ensemble and tape. Written especially for Daylight Music 312 to celebrate the 50th anniversary of the Moon Landing.",
      "Performers: Iris Garrelfs (vocals), Roger Redgate (violin & electronics), Adrian Montufar (flute), Michael Zbyszynski (saxophones), Shereen Mourtsing (electric guitar & pedals), Ashley Paul (tenor saxophone), Daniel Ross (piano & electronics).",
    ],
    links: [{ label: "Daylight Music 312", url: "https://daylightmusic.co.uk" }],
  },
  {
    slug: "tracing-the-sky",
    title: "Tracing the Sky",
    excerpt: "Interactive audio spatialisation for Jiayu Liu's installation at Manchester International Festival.",
    image: `${IMG}/2020/02/8-1-1.jpg`,
    tags: ["Algorithmic Composition", "sound art"],
    body: [
      "Daniel James Ross developed the interactive audio spatialisation for this immersive installation, exhibited 14–20 July 2019 at Manchester International Festival.",
      "In Jiayu Liu's Tracing the Sky, a hidden underground space in a busy city is transformed into an immersive sanctuary. Under a Victorian shopping arcade, a space void of physical content is filled with floating motion graphics emerging from the brick walls of a deep basement hideaway.",
    ],
    links: [
      { label: "Jiayu Liu — Tracing the Sky", url: "http://www.jiayuliu.studio/tracing-the-sky" },
      { label: "Future Everything", url: "https://futureeverything.org/event/tracing-the-sky/" },
    ],
  },
];

export const compositions: Composition[] = [
  {
    title: "Bata Kusai",
    year: 2018,
    description: "For shakuhachi & electronics. Recorded live at the World Shakuhachi Festival 2018.",
  },
  {
    title: "King Canute: Eat Your Heart Out!",
    year: 2018,
    description: "Recorded live on the beach at the Whitstable Biennial 2018.",
  },
  {
    title: "Miniature Fantasy for Toy Piano & Electronics",
    year: 2017,
    description: "Recorded live at IKLECTIK on 18 March 2017 for World Toy Piano Day. Xenia Pestova, toy piano; DJR, electronics.",
  },
  {
    title: "HEROES",
    year: 2017,
    description: "Extract from a live performance by a new duo with Jessica Aslan.",
  },
  {
    title: "quid pro qua qua",
    year: 2016,
    description: "Algorithmic analysis and re-generation of recorded improvisations with real-time electronics.",
  },
  {
    title: "Penance",
    year: 2016,
    description: "Algorithmically manipulated choral music and real-time electronics.",
  },
  {
    title: "Rondo del Computer",
    year: 2016,
    description: "For disklavier.",
  },
  {
    title: "Roddart: Explode",
    year: 2016,
    description: "Trumpet & real-time electronics.",
  },
  {
    title: "Prelude for Disklavier & Electronics",
    year: 2015,
    description: "Disklavier & score-following electronics.",
  },
  {
    title: "Huge Noise",
    year: 2015,
    description: "For SATB choir.",
  },
  {
    title: "Roddart: I Remember",
    year: 2015,
    description: "Trumpet & real-time electronics.",
  },
  {
    title: "The Fib",
    year: 2014,
    description: "Two sopranos, alto & score-following electronics.",
    scoreUrl: "https://imgur.com/VxOYFmQ",
  },
  {
    title: "Soluble in Water",
    year: 2010,
    description: "For organ, cathedral & live multichannel electronics.",
    scoreUrl: "https://imgur.com/a/KHjHi",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
