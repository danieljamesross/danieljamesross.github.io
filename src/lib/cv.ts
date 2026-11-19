export type CvRole = {
  title: string;
  dates: string;
  points: string[];
};

export type CvJob = {
  company: string;
  roles: CvRole[];
};

export type CvSkillGroup = {
  label: string;
  skills: string[];
};

export type CvEducation = {
  qualification: string;
  institution: string;
  dates: string;
};

export const cvHeadline = "Senior Software Engineer — TypeScript, React, Node";

export const cvSummary = [
  "Software engineer with over six years of production experience in TypeScript, React and Node. At tldraw I built the team's internal React tools with Cloudflare backends. I made them safe and maintainable with sandboxed staging data, tiered API keys, preview deploys and automated code checks.",
  "I use coding agents to augment my workflow, not replace it. UK based and happy working remotely.",
];

export const cvLinks = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/dan-ross-5b729521a/" },
  { label: "GitHub", url: "https://github.com/danieljamesross" },
];

export const cvExperience: CvJob[] = [
  {
    company: "tldraw",
    roles: [
      {
        title: "Solutions Engineer",
        dates: "Apr 2026 – Sep 2026",
        points: [
          "Updated legacy AI-generated internal tools to make them safe and maintainable",
          "Designed and built internal tools for the sales and marketing teams",
          "Created staging environments with sandboxed copies of CRM data, and replaced a shared production API key with tiered keys",
          "Built GitHub Actions that deployed temporary Cloud Run previews for user testing, plus pre-commit hooks, lint checks and an AI code review bot",
          "Hosted backend services on Cloudflare for internal canvas apps and client prototypes",
          "Built a canvas-based AI video editing app in React as a client demo in days, using Claude Code",
        ],
      },
    ],
  },
  {
    company: "IRIS Audio Technologies",
    roles: [
      {
        title: "Lead Web Developer",
        dates: "May 2023 – Mar 2026",
        points: [
          "Led the web team and owned projects end to end, working with product, design, ML and legal",
          "Helped build the customer account dashboard, which reported each customer's usage data and let them interact with it",
          "Built a custom CMS with GraphQL endpoints behind the Next.js company site, iris.audio, with near-100 Lighthouse scores",
          "Built the IRIS Web SDK in TypeScript, with C++ bindings for WebAssembly, Node.js and Python, plus its licensing, API key authentication and documentation",
          "Diagnosed a live audio fault in a client's system and fixed it with their engineers",
          "Wrote and maintained unit, integration and end-to-end test suites in Jest and Cypress",
        ],
      },
      {
        title: "Senior Web Developer and Team Lead",
        dates: "May 2022 – May 2023",
        points: [
          "Introduced CI pipelines, automated testing and code standards with ESLint and Prettier across the team",
          "Mentored junior developers and led the migration of all web projects from JavaScript to TypeScript",
        ],
      },
      {
        title: "Creative Developer",
        dates: "Oct 2021 – Apr 2022",
        points: ["Built interactive web audio products in React."],
      },
    ],
  },
  {
    company: "Phantom",
    roles: [
      {
        title: "Junior Creative Technologist",
        dates: "2020 – 2021",
        points: [
          "Built interactive web experiences and pitch prototypes for Google and Sony.",
        ],
      },
    ],
  },
  {
    company: "Beckenham Place Park Soundwalk",
    roles: [
      {
        title: "Sound Artist and Creative Coder",
        dates: "2018",
        points: [
          "Built a gamified, location-based audio experience from stories gathered from local people, funded by the Heritage Lottery Fund.",
        ],
      },
    ],
  },
  {
    company: "Freelance, Goldsmiths and Morley College",
    roles: [
      {
        title: "AV Technician, Sound Engineer and Lecturer",
        dates: "2010 – 2020",
        points: [
          "Ran sound, video and webcasts for live events, and taught music computing.",
        ],
      },
    ],
  },
];

export const cvSkills: CvSkillGroup[] = [
  {
    label: "Languages and frameworks",
    skills: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "REST APIs",
      "GraphQL",
      "C++",
      "WebAssembly",
      "Python",
      "C#",
      "Unity",
    ],
  },
  {
    label: "Infrastructure and tooling",
    skills: [
      "Cloudflare",
      "Google Cloud Run",
      "GitHub Actions",
      "CI/CD",
      "Staging environments",
      "Secrets management",
    ],
  },
  {
    label: "Testing and quality",
    skills: [
      "Jest",
      "Cypress",
      "Unit, integration and end-to-end testing",
      "ESLint",
      "Prettier",
      "Code review",
    ],
  },
  {
    label: "Ways of working",
    skills: [
      "Internal tools and automation",
      "Claude Code and agentic workflows",
      "Rapid prototyping",
      "Technical writing",
      "Team leadership and mentoring",
    ],
  },
];

export const cvEducation: CvEducation[] = [
  {
    qualification: "MSc Digital Composition and Performance",
    institution: "The University of Edinburgh",
    dates: "2009 – 2010",
  },
  {
    qualification: "BMus (Hons) Music",
    institution: "The University of Edinburgh",
    dates: "2003 – 2009",
  },
];
