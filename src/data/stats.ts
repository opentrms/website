export interface Stat {
  label: string;
  value: string;
  description: string;
}

// All numbers verified directly from the codebase.
// Modules: pom.xml <module> entries = 16
// Controllers: glob trms-api/src/main/java/io/trms/api/controller/*Controller.java = 24
// Feature files: glob trms-test/src/test/resources/features/**/*.feature = 72
// Scenarios: grep "^\s*Scenario" across all feature files = 926
// Deal states: DealStatus.java permits clause = 11
// JSON schemas: glob schemas/**/*.json = 34
// Batch step executors: glob trms-batch/src/main/java/io/trms/batch/steps/*Executor.java = 14
export const stats: Stat[] = [
  {
    label: 'Maven Modules',
    value: '16',
    description: 'Independently deployable modules from domain to AI agents',
  },
  {
    label: 'REST Endpoints',
    value: '24',
    description: 'Controllers covering deals, valuations, settlements, approvals, and more',
  },
  {
    label: 'BDD Scenarios',
    value: '926',
    description: 'Cucumber scenarios across 72 feature files — every behaviour is specified and verified',
  },
  {
    label: 'Deal Lifecycle States',
    value: '11',
    description: 'Sealed-interface states: Draft → PendingReview → Confirmed → Settling → Settled → Accounted → Matured / Terminated / Rejected / Cancelled / ClosedOut',
  },
  {
    label: 'JSON Schemas',
    value: '34',
    description: 'Draft 2020-12 schemas for deals, instruments, roles, approvals, STP rules, and extensions',
  },
  {
    label: 'EOD Batch Steps',
    value: '14',
    description: 'End-of-day orchestration steps: curves, fixings, cashflows, valuation, accruals, journals, margin, netting, closeout, compliance, simulation, cash sweep, scheduled events, audit',
  },
];
