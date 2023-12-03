/**
 * @author SaiForceOne
 * @description Collection of general-use utility functions
 */
// ST🌀RM Stack Imports
import ScaffoldOutput = STRMStackCLI.ScaffoldOutput;

// exclude starting with
const VALID_DESTINATION_PATTERN = /^[a-z]\w+$/gim;

/**
 * @description Helper function to validate a project or module name. Valid project names should start with a letter and not
 * contain spaces or dashes
 * @param {string} projectName
 */
export function validateProjectOrModuleName(projectName: string) {
  if (!projectName) return;
  return projectName.match(VALID_DESTINATION_PATTERN);
}

/**
 * @description Helper function that returns a standard scaffold output object
 */
export function buildScaffoldOutput(): ScaffoldOutput {
  return {
    message: '',
    success: false,
  };
}
