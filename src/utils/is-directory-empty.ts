/* eslint-disable no-console */

import * as FS from "node:fs";
import * as Path from "node:path";
import FMT from "picocolors";

export const isDirectoryEmpty = (root: string, name: string) => {
  const validFiles = [
    ".DS_Store",
    ".git",
    ".gitattributes",
    ".gitignore",
    ".gitlab-ci.yml",
    ".hg",
    ".hgcheck",
    ".hgignore",
    ".idea",
    ".npmignore",
    ".travis.yml",
    "LICENSE",
    "Thumbs.db",
    "docs",
    "mkdocs.yml",
    "npm-debug.log",
    "yarn-debug.log",
    "yarn-error.log",
    "yarnrc.yml",
    ".yarn",
  ];

  const conflicts = FS.readdirSync(root).filter(
    file =>
      !validFiles.includes(file) &&
      // Support IntelliJ IDEA-based editors
      !/\.iml$/.test(file),
  );

  if (conflicts.length > 0) {
    console.log();
    console.log(
      `The directory ${FMT.green(name)} contains files that could conflict:`,
    );

    for (const file of conflicts) {
      try {
        const stats = FS.lstatSync(Path.join(root, file));

        if (stats.isDirectory()) {
          console.log(`  ${FMT.blue(file)}/`);
        } else {
          console.log(`  ${file}`);
        }
      } catch {
        console.log(`  ${file}`);
      }
    }

    console.log(
      "Either try using a new directory name, or remove the files listed above.\n",
    );

    return false;
  }

  return true;
};
