/* eslint-disable no-console */

import { exec } from "node:child_process";
import * as FS from "node:fs";
import * as Path from "node:path";
import * as Process from "node:process";
import { promisify } from "node:util";
import { prerelease, valid } from "semver";

const execCmd = promisify(exec);

const packagePath = Process.cwd();

const distPath = Path.join(packagePath, "./dist");

void (async () => {
  const distPackagePath = Path.join(distPath, "package.json");

  const packageJSON = JSON.parse(
    await FS.promises.readFile(distPackagePath, "utf-8"),
  ) as Record<string, unknown>;

  if (!packageJSON.version) {
    console.error("No `version` property found.");
    Process.exit(1);
  }

  const version = valid(packageJSON.version as string);

  if (!version) {
    console.error("The `version` property isn't valid.");
    Process.exit(1);
  }

  const prereleaseComponents = prerelease(version);
  const channel = (prereleaseComponents?.[0] ?? "latest") as string;

  const { stderr, stdout } = await execCmd(
    `npm publish ./dist/ --tag ${channel}`,
  );

  console.log({ stdout });
  console.error({ stderr });
})();
