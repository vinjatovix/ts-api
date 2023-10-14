
const common = [
  '--require-module ts-node/register' // Load TypeScript module
];

const apiApp = [
  ...common,
  'tests/apps/apiApp/features/**/*.feature',
  '--require tests/apps/apiApp/features/step_definitions/*.steps.ts'
].join(' ');

module.exports = {
  apiApp
};
