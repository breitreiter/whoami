// Personal site content.
// Keep copy short. Mono type punishes long lines.

window.SITE = {
  identity: {
    handle: 'breitreiter',
    host: 'dreamlands.org',
    name: 'Joseph Breitreiter',
    role: 'Principal UX Designer, AI at Tricentis',
    location: 'Austin, TX',
    pronouns: 'he/him',
    status: 'Helping humans and AI understand each other and get stuff done.',
    lat: '30.2672N',
    lon: '097.7431W',
  },

  // Short, present tense.
  about: [
    "Full-stack designer — ten years UX, six years front-end, four years back-end.",
    "I design products that make technical professionals look good. My background",
    "is in data sensemaking — how users sift through, draw conclusions, and build",
    "cases from large volumes of data — and most of my work now is on how that",
    "task changes when an AI agent is in the loop. I spend most of my time",
    "prototyping: equally happy in Figma, a code editor, or five Claude Code sessions."
  ].join(' '),

  // Side projects — public repos. Renderer wraps text in a TermLink when href is set.
  now: [
    { label: 'dreamlands', text: 'A web-based narrative CRPG.',                    href: 'https://github.com/breitreiter/dreamlands' },
    { label: 'nb',         text: 'AI terminal swiss army knife.',                  href: 'https://github.com/breitreiter/nb' },
    { label: 'imp',        text: 'A coding harness for your coding harness.',      href: 'https://github.com/breitreiter/imp' },
    { label: 'UglyPrompt', text: 'Permissively-licensed modern ReadLine for REPLs.', href: 'https://github.com/breitreiter/UglyPrompt' },
  ],

  // Work history — jobs as spec cards. Most recent first.
  // status: 'ongoing' for current role, 'past' for prior. The Tag component
  // will pick up tone via tag--ongoing / tag--past (defined in site.css).
  work: [
    {
      id: 'tricentis',
      name: 'Tricentis',
      tagline: 'Enterprise software testing and quality automation.',
      status: 'ongoing',
      version: '',
      date: '2025 – present',
      role: 'Principal UX Designer, AI',
      team: 'Enterprise',
      stack: ['Figma', 'C#', 'vibes'],
      body: [
        "Designing and coordinating a unified experience for Tricentis’s AI",
        "features. Ensuring our AI strategy centers and empowers humans."
      ].join(' '),
      links: [
        { label: 'case', href: 'case/qdash.html', display: 'qDash Dashboards' }
      ],
    },
    {
      id: 'grafana',
      name: 'Grafana',
      tagline: 'Open-source and cloud observability.',
      status: 'past',
      version: '',
      date: '2023 – 2025',
      role: 'Staff Designer',
      team: 'Mid-sized',
      stack: ['Figma'],
      body: [
        "Started with the as-code team developing patterns for automating and",
        "provisioning Grafana. Moved to the AI/ML team doing industry, technical,",
        "and customer research to shape how Grafana leveraged these technologies."
      ].join(' '),
      links: [],
    },
    {
      id: 'featurebase',
      name: 'FeatureBase',
      tagline: 'Realtime database powered by bitmaps.',
      status: 'past',
      version: '',
      date: '2021 – 2023',
      role: 'Principal Designer',
      team: 'Startup',
      stack: ['Figma', 'Zeplin', 'design ops'],
      body: [
        "Brought in to design the company's new SaaS UI. Also built out the bones",
        "of a design process (ceremonies, tooling, design system) and a research",
        "practice (process + a core of friendly users)."
      ].join(' '),
      links: [
        { label: 'case', href: 'case/featurebase.html', display: 'FeatureBase SaaS' },
        { label: 'case', href: 'case/aiml.html',        display: 'AI/ML Visiontype' },
      ],
    },
    {
      id: 'solarwinds',
      name: 'SolarWinds',
      tagline: 'Enterprise ITOM and observability.',
      status: 'past',
      version: '',
      date: '2011 – 2021',
      role: 'Lead Engineer / Principal Designer',
      team: 'Market leader',
      stack: ['C#', 'Flex', 'Axure', 'Sketch'],
      body: [
        "First year integrating Hyper9 into the SolarWinds product family.",
        "Then nine years leading design on three new products, three major",
        "platform features, and countless feature releases."
      ].join(' '),
      links: [
        { label: 'case', href: 'case/perfstack.html',   display: 'Performance Analyzer' },
        { label: 'case', href: 'case/logmanager.html',  display: 'Log Manager' },
        { label: 'case', href: 'case/dashboards.html',  display: 'Nova Dashboards' },
      ],
    },
    {
      id: 'hyper9',
      name: 'Hyper9',
      tagline: 'Search-based tools for virtual environments.',
      status: 'past',
      version: '',
      date: '2007 – 2011',
      role: 'UI Lead',
      team: 'Startup',
      stack: ['jQuery', 'Flex', 'Maven', 'Lucene'],
      body: [
        "Search-based tools for managing virtual environments. Led UI design;",
        "built first as an HTML/XHR SPA, then in Flex. Acquired by SolarWinds."
      ].join(' '),
      links: [],
    },
  ],

  // Off-site presence.
  elsewhere: [
    { label: 'email',    handle: 'contact@dreamlands.org', href: 'mailto:contact@dreamlands.org' },
    { label: 'linkedin', handle: 'in/breitreiter',         href: 'https://www.linkedin.com/in/breitreiter/' },
    { label: 'instagram',handle: '@cairtheand',            href: 'https://www.instagram.com/cairtheand/' },
    { label: 'goodreads',handle: 'joseph-breitreiter',     href: 'https://www.goodreads.com/review/list/34554197-joseph-breitreiter' },
    { label: 'resume',   handle: 'JBreitreiter_Resume.pdf', href: 'JBreitreiter_Resume.pdf' },
  ],
};
