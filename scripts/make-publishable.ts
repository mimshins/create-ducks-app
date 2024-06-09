import * as FS from "node:fs";
import * as Path from "node:path";
import * as Process from "node:process";

const packagePath = Process.cwd();

const distPath = Path.join(packagePath, "dist");

const createNpmRc = async () => {
  const npmrcPath = Path.join(distPath, ".npmrc");
  const npmignorePath = Path.join(distPath, ".npmignore");

  await FS.promises.writeFile(
    npmrcPath,
    [
      "//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}",
      "registry=https://registry.npmjs.org/",
      "always-auth=true",
    ].join("\n"),
  );

  await FS.promises.writeFile(npmignorePath, ".npmrc");
};

const run = async () => {
  const distPackageJsonFile = Path.join(distPath, "package.json");
  const rootPackageJsonFile = Path.join(packagePath, "package.json");

  const {
    name,
    version,
    description,
    type,
    engines,
    bin,
    repository,
    keywords,
    publishConfig,
  } = JSON.parse(
    await FS.promises.readFile(rootPackageJsonFile, { encoding: "utf-8" }),
  ) as Record<string, unknown>;

  await FS.promises.writeFile(
    distPackageJsonFile,
    JSON.stringify(
      {
        sideEffects: false,
        name,
        version,
        description,
        type,
        bin,
        engines,
        repository,
        keywords,
        publishConfig,
      },
      null,
      2,
    ),
  );

  const readmeFile = Path.join(packagePath, "README.md");

  await FS.promises.copyFile(readmeFile, Path.join(distPath, "README.md"));

  await createNpmRc();
};

void (async () => {
  await run();
})();
