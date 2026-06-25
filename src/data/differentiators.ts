export interface Differentiator {
  title: string;
  description: string;
  proof: string;       // Link text pointing to GitHub source
  proofPath: string;   // Relative path in repo (for GitHub URL construction)
}

// All proofPath values verified against actual files/directories in the codebase.
export const differentiators: Differentiator[] = [
  {
    title: 'Open Source (Apache 2.0)',
    description:
      'Every line of production code is public. No black boxes, no vendor lock-in, no per-seat fees. Fork it, modify it, ship it.',
    proof: 'View LICENSE',
    proofPath: 'LICENSE',
  },
  {
    title: 'AI-Native from Day One',
    description:
      'Spring AI ChatClient agents with @Tool definitions and an MCP server. Natural language deal capture, approval routing, and portfolio queries — wired directly into the domain, not bolted on.',
    proof: 'DealAgent.java',
    proofPath: 'trms-ai/src/main/java/io/trms/ai/agent/DealAgent.java',
  },
  {
    title: 'Java 21 — No Legacy Baggage',
    description:
      'Virtual threads, sealed interfaces, records, and pattern-matching switch expressions throughout. DealStatus is a sealed interface with 11 exhaustively-checked states — no stringly-typed enums.',
    proof: 'DealStatus.java',
    proofPath: 'trms-domain/src/main/java/io/trms/domain/deal/DealStatus.java',
  },
  {
    title: 'Tamper-Evident Event Sourcing',
    description:
      'Every mutation is an immutable event. A SHA-256 hash chain links each event to its predecessor, making history falsification cryptographically detectable.',
    proof: 'HashChainService.java',
    proofPath: 'trms-event-store/src/main/java/io/trms/eventstore/hash/HashChainService.java',
  },
  {
    title: 'PostgreSQL — No Proprietary Database Tax',
    description:
      'Runs on PostgreSQL 16 (production) or H2 in PostgreSQL mode (local dev). No Oracle license, no Sybase dependency, no bundled database surprises.',
    proof: 'Flyway migrations',
    proofPath: 'trms-event-store/src/main/resources/db',
  },
  {
    title: 'Developer Experience First',
    description:
      'One command to run locally (`mvn spring-boot:run -Dspring.profiles.active=local`), Swagger UI at /docs, full Cucumber BDD suite with Testcontainers — all included out of the box.',
    proof: '926 BDD scenarios across 72 feature files',
    proofPath: 'trms-test/src/test/resources/features',
  },
  {
    title: '16-Module Architecture',
    description:
      'Domain has zero framework dependencies. Each module — domain, event-store, validation, workflow, auth, valuation, accounting, settlement, closeout, credit, AI, batch, Python, API — is independently testable and replaceable.',
    proof: 'pom.xml (root)',
    proofPath: 'pom.xml',
  },
  {
    title: 'JSON Schema Extensibility',
    description:
      '34 Draft 2020-12 schemas covering 17 deal product types, 4 instrument types, roles, approval chains, STP rules, and customer extension metadata. Add a new asset class without touching Java.',
    proof: 'schemas/',
    proofPath: 'schemas',
  },
  {
    title: 'Full Trade Lifecycle',
    description:
      'Deal capture → STP routing → multi-step approval chains → cashflow generation → real-time valuation → settlement → netting → journal entries → EOD batch — all in one system.',
    proof: '24 REST controllers',
    proofPath: 'trms-api/src/main/java/io/trms/api/controller',
  },
  {
    title: 'BDD-Tested, Every Behaviour Specified',
    description:
      'Every feature — from STP rules to credit engine to AI agent flows — is expressed as a Gherkin scenario. 926 scenarios across 72 feature files mean the system\'s behaviour is always documented and always verified.',
    proof: 'trms-test feature files',
    proofPath: 'trms-test/src/test/resources/features',
  },
];
