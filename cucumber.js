
const common = [
  '--require-module ts-node/register' // Load TypeScript module
];

const apiApp_backend = [
  ...common,
  'tests/apps/apiApp/backend/features/**/*.feature',
  '--require tests/apps/apiApp/backend/features/step_definitions/*.steps.ts'
].join(' ');

module.exports = {
  apiApp_backend
};
