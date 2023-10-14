/**
 * @author SaiForceOne
 * @description A collection of utility functions specific to the filesystem
 */

import path from 'node:path';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { ConsoleLogger } from './consoleLogger.js';

import FTLConfigFile = FTLStackCLI.FTLConfigFile;
import ScaffoldOutput = FTLStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from './generalUtils.js';
import FTLProjectPkgFile = FTLStackCLI.FTLProjectPkgFile;

/**
 * @async
 * @function destinationPathExists
 * @param {string} path - represents the destination the project should be generated in
 * @return Promise<boolean>
 */
export async function destinationPathExists(path: string): Promise<boolean> {
  try {
    const fileStats = await stat(path);
    return !!fileStats;
  } catch (e) {
    return false;
  }
}

/**
 * @deprecated
 * @param path
 */
export function isInProjectDir(path: string): boolean {
  return process.cwd() === path;
}

/**
 * @async
 * @function getProjectConfig
 * @param {string} projectRoot
 * @returns {Promise<FTLConfigFile|undefined>}
 * @description Helper function that reads the config file from disk and returns
 * a "typed" JSON object to make it easier to update the project config
 */
export async function getProjectConfig(
  projectRoot: string
): Promise<FTLConfigFile | undefined> {
  try {
    // 1. try to load config file
    const configFilePath = path.resolve(
      projectRoot,
      'ftl_config',
      'ftl_config.json'
    );

    const configFileData = await readFile(configFilePath, {
      encoding: 'utf-8',
    });
    return JSON.parse(configFileData) as FTLConfigFile;
  } catch (e) {
    ConsoleLogger.printLog(
      `Failed to read project with error: ${(e as Error).message}`
    );
  }
}

/**
 * @async
 * @function getProjectPkg
 * @param {string} projectPath the directory of the project (destination directory)
 * @returns {Promise<FTLProjectPkgFile|undefined>}
 * @description Helper function that reads the project's package.json file and returns
 * it as "typed" object or undefined if it fails
 */
export async function getProjectPkg(
  projectPath: string
): Promise<FTLProjectPkgFile | undefined> {
  try {
    const pkgFilePath = path.resolve(projectPath, 'package.json');
    const pkgFileData = await readFile(pkgFilePath, { encoding: 'utf-8' });
    return JSON.parse(pkgFileData) as FTLProjectPkgFile;
  } catch (e) {
    ConsoleLogger.printLog(
      `Failed to read project pkg file with error: ${(e as Error).message}`
    );
  }
}

/**
 *
 * @param {string} destinationRoot The root folder of the file to be over-written
 * @param {string} targetFile The name of the file to be written. ex: package.json
 * @param {string} data The data to be written to the target file. Typically,
 * this will be the result of JSON.stringify()
 */
export async function writeProjectConfigData(
  destinationRoot: string,
  targetFile: string,
  data: string
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    const targetPath = path.resolve(destinationRoot, targetFile);

    await writeFile(targetPath, data);

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
