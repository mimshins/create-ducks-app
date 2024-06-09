#!/usr/bin/env node
/* eslint-disable no-console */

import { Command, CommanderError } from "@commander-js/extra-typings";
import ci from "ci-info";
import * as FS from "node:fs";
import * as Path from "node:path";
import * as Process from "node:process";
import FMT from "picocolors";
import prompts, { type InitialReturnValue } from "prompts";
import checkUpdate from "update-check";
import packageJson from "../package.json";
import { createApp } from "./create-app";
import type { PackageManager } from "./types";
import {
  isDirectoryEmpty,
  resolvePackageManager,
  validateNpmPackage,
} from "./utils";

process.on("SIGINT", () => Process.exit(0));
process.on("SIGTERM", () => Process.exit(0));

const onPromptState = (state: {
  value: InitialReturnValue;
  aborted: boolean;
  exited: boolean;
}) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    Process.stdout.write("\x1B[?25h");
    Process.stdout.write("\n");
    Process.exit(1);
  }
};

const { name, version } = packageJson as unknown as {
  name: string;
  version: string;
};

let projectDirectory = "";

const program = new Command(name)
  .version(version)
  .arguments("<project-directory>")
  .usage(`${FMT.green("<project-directory>")} [options]`)
  .option(
    "--skip-install",
    "Explicitly tell the CLI to skip installing packages",
  )
  .option(
    "--use-npm",
    "Explicitly tell the CLI to bootstrap the application using npm",
  )
  .option(
    "--use-pnpm",
    "Explicitly tell the CLI to bootstrap the application using pnpm",
  )
  .option(
    "--use-yarn",
    "Explicitly tell the CLI to bootstrap the application using yarn",
  )
  .action(directory => {
    projectDirectory = directory;
  })
  .allowUnknownOption()
  .exitOverride(err => {
    if (ci.isCI || err.code !== "commander.missingArgument") {
      Process.exit(err.exitCode);
    }

    throw err;
  });

try {
  program.parse();
} catch (err) {
  if (
    !(err instanceof CommanderError) ||
    err.code !== "commander.missingArgument"
  ) {
    throw err;
  }
}

const {
  skipInstall = false,
  useNpm = false,
  usePnpm = false,
  useYarn = false,
} = program.opts();

let packageManager: PackageManager;

if (useNpm) packageManager = "npm";
else if (usePnpm) packageManager = "pnpm";
else if (useYarn) packageManager = "yarn";
else packageManager = resolvePackageManager();

const run = async () => {
  if (!projectDirectory) {
    console.log();

    const prompt = await prompts({
      onState: onPromptState,
      type: "text",
      name: "project-name",
      message: "What is your project name?",
      initial: "my-ducks-app",
      validate: name => {
        const validation = validateNpmPackage(
          Path.basename(Path.resolve(name as string)),
        );

        if (validation.isValid) return true;

        return ["Invalid project name:", ...validation.issues].join("\n");
      },
    });

    if (typeof prompt["project-name"] === "string") {
      // eslint-disable-next-line require-atomic-updates
      projectDirectory = prompt["project-name"].trim();
    } else {
      console.log("\n");
      console.log(
        [
          "Please specify the project name/directory:",
          `  ${FMT.cyan(program.name())} ${FMT.green("<project-name>")}`,
          "For example:",
          `  ${FMT.cyan(program.name())} ${FMT.green("my-ducks-app")}`,
          `Run ${FMT.cyan(`${program.name()} --help`)} to see all options.`,
        ].join("\n"),
      );
      Process.exit(1);
    }
  }

  projectDirectory = projectDirectory.trim();

  const projectPath = Path.resolve(projectDirectory);
  const root = Path.resolve(projectPath);
  const appName = Path.basename(root);

  if (FS.existsSync(root) && !isDirectoryEmpty(root, appName)) {
    Process.exit(1);
  }

  await createApp({ appPath: projectPath, packageManager, skipInstall });
};

const notifyUpdate = async () => {
  try {
    const updateResult = await checkUpdate(packageJson);

    if (!updateResult) return;
    if (!updateResult.latest) return;

    const updateCommands = {
      pnpm: "pnpm add -g create-ducks-app",
      npm: "npm i -g create-ducks-app",
      yarn: "yarn global add create-ducks-app",
    } satisfies Record<PackageManager, string>;

    const updateCommand = updateCommands[packageManager];

    console.log(
      [
        FMT.yellow(
          FMT.bold("A new version of `create-ducks-app` is available."),
        ),
        `You can update by running: ${FMT.cyan(updateCommand)}`,
      ].join("\n"),
    );
  } catch {
    // Ignore
  }
};

void (async () => {
  try {
    await run();
    await notifyUpdate();
  } catch {
    console.log("Aborting installation.");
    Process.exit(1);
  }
})();
