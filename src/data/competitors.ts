export interface Competitor {
  name: string;
  licenseCost: string;
  sourceAccess: string;
  aiIntegration: string;
  database: string;
  techStack: string;
  eventSourcing: string;
  setupTime: string;
  customization: string;
  bddTests: string;
}

// BDD scenario count verified: grep "^\s*Scenario" across 72 feature files = 926 scenarios
export const opentrms: Competitor = {
  name: 'OpenTRMS',
  licenseCost: '$0/yr',
  sourceAccess: 'Full (Apache 2.0)',
  aiIntegration: 'Native (Spring AI + MCP)',
  database: 'PostgreSQL ($0)',
  techStack: 'Java 21',
  eventSourcing: 'Built-in (SHA-256 chain)',
  setupTime: '5 minutes',
  customization: 'JSON schemas + Python rules',
  bddTests: '926 scenarios',
};

// Competitor pricing and capabilities are based on publicly available market information.
export const competitors: Competitor[] = [
  {
    name: 'Murex MX.3',
    licenseCost: '$2–5M/yr',
    sourceAccess: 'None',
    aiIntegration: 'Add-on (extra cost)',
    database: 'Proprietary (bundled)',
    techStack: 'C++ / Java (legacy)',
    eventSourcing: 'None',
    setupTime: '12–24 months',
    customization: 'Proprietary scripting (MXML)',
    bddTests: 'Not public',
  },
  {
    name: 'Calypso / Adenza',
    licenseCost: '$1–4M/yr',
    sourceAccess: 'None',
    aiIntegration: 'None (roadmap)',
    database: 'Sybase / MS SQL (bundled)',
    techStack: 'Java (legacy)',
    eventSourcing: 'None',
    setupTime: '12–18 months',
    customization: 'Proprietary config',
    bddTests: 'Not public',
  },
  {
    name: 'Findur / ION',
    licenseCost: '$1–3M/yr',
    sourceAccess: 'None',
    aiIntegration: 'None',
    database: 'Proprietary (OpenJvs)',
    techStack: 'OpenJvs (proprietary)',
    eventSourcing: 'None',
    setupTime: '18–36 months',
    customization: 'Proprietary scripting (OpenJvs)',
    bddTests: 'Not public',
  },
  {
    name: 'FIS Apex',
    licenseCost: '$1–3M/yr',
    sourceAccess: 'None',
    aiIntegration: 'None',
    database: 'Oracle (extra cost)',
    techStack: 'Java / .NET (legacy)',
    eventSourcing: 'None',
    setupTime: '12–24 months',
    customization: 'Vendor-managed only',
    bddTests: 'Not public',
  },
  {
    name: 'Finastra Fusion',
    licenseCost: '$500K–2M/yr',
    sourceAccess: 'None',
    aiIntegration: 'Limited (FusionFabric API)',
    database: 'MS SQL (bundled)',
    techStack: 'Java / .NET (legacy)',
    eventSourcing: 'None',
    setupTime: '6–18 months',
    customization: 'FusionFabric extensions',
    bddTests: 'Not public',
  },
];

export const comparisonFeatures: { key: keyof Competitor; label: string }[] = [
  { key: 'licenseCost', label: 'Annual License Cost' },
  { key: 'sourceAccess', label: 'Source Code Access' },
  { key: 'aiIntegration', label: 'AI Integration' },
  { key: 'database', label: 'Database Requirement' },
  { key: 'techStack', label: 'Tech Stack' },
  { key: 'eventSourcing', label: 'Event Sourcing' },
  { key: 'setupTime', label: 'Time to First Trade' },
  { key: 'customization', label: 'Customization Model' },
  { key: 'bddTests', label: 'Test Transparency' },
];
