# create-ducks-app

A CLI tool for quickly start using ducks static documentation website.

## Interactive Usage

You can create a new project interactively by running:

```bash
pnpm create ducks-app

yarn create ducks-app

npx create-ducks-app
```

You will be asked for the name of your project.

```bash
? What is your project name? › my-ducks-app
```

## Non-interactive Usage

You can also pass command line arguments to set up a new project non-interactively.

```bash
pnpm create ducks-app <project-directory> [options]

yarn create ducks-app <project-directory> [options]

npx create-ducks-app <project-directory> [options]
```

Here are the options:

```bash
Options:
  -V, --version   Output the version number
  --skip-install  Explicitly tell the CLI to skip installing packages
  --use-npm       Explicitly tell the CLI to bootstrap the application using npm
  --use-pnpm      Explicitly tell the CLI to bootstrap the application using pnpm
  --use-yarn      Explicitly tell the CLI to bootstrap the application using yarn
  -h, --help      Display help for command
```
