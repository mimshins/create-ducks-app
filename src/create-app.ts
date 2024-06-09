/* eslint-disable no-console */

import * as FS from "node:fs";
import * as Path from "node:path";
import * as Process from "node:process";
import FMT from "picocolors";
import type { PackageManager } from "./types";
import { isDirectoryEmpty, isWriteable } from "./utils";
import { installTemplate } from "./utils/install";

export const createApp = async (params: {
  appPath: string;
  packageManager: PackageManager;
  skipInstall: boolean;
}) => {
  const { appPath, packageManager, skipInstall } = params;

  const root = Path.resolve(appPath);

  if (!(await isWriteable(Path.dirname(root)))) {
    console.error(
      [
        "The application path is not writable, please check folder permissions and try again.",
        "It is likely you do not have write permissions for this folder.",
      ].join("\n"),
    );

    Process.exit(1);
  }

  const appName = Path.basename(root);

  FS.mkdirSync(root, { recursive: true });

  if (!isDirectoryEmpty(root, appName)) Process.exit(1);

  await installTemplate({
    appPath,
    appName,
    root,
    packageManager,
    skipInstall,
  });

  console.log();
  console.log(
    `${FMT.green(FMT.bold("Success!"))} Created ${appName} at ${FMT.green(appPath)}.`,
  );
  console.log("Inside that directory, you can run several commands:\n");
  console.log(FMT.cyan(`  ${packageManager} run build`));
  console.log("  Builds the documentation for production.\n");
  console.log(FMT.cyan(`  ${packageManager} run preview`));
  console.log("  Runs the built documentation in production mode.");
  console.log();
};
