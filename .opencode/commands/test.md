---
description: Test command for almighty-tool project
template: |
  Run the full test suite for almighty-tool and ensure all tests pass.
  Focus on any failing tests and suggest fixes.
  Also check TypeScript compilation with `npm run tsc`.
  
  Project details:
  - TypeScript utility library
  - Uses Jest with power-assert
  - Target: Node.js and browser environments (ES5)
  - Must maintain WeChat Mini Program compatibility
  - Test with `bun test` or `npm run test`
  
  If tests fail:
  1. Analyze the error messages
  2. Check if the issue is related to implementation
  3. Verify TypeScript types are correct
  4. Ensure WeChat Mini Program compatibility is maintained
  5. Provide specific fixes for failing tests
  
  Always run tests before suggesting changes and verify they pass.
description: Run tests with coverage and check for failures
agent: test-runner
---

Run the tests and check for any failures.
