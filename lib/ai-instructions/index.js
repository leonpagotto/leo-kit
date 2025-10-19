const AIInstructionsBuilder = require('./builder');
const CopilotAdapter = require('./adapters/copilot-adapter');
const CursorAdapter = require('./adapters/cursor-adapter');
const ClineAdapter = require('./adapters/cline-adapter');
const CodeiumAdapter = require('./adapters/codeium-adapter');

module.exports = {
  AIInstructionsBuilder,
  CopilotAdapter,
  CursorAdapter,
  ClineAdapter,
  CodeiumAdapter
};
