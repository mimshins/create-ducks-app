export const kebabToCamel = (kebabcase: string) =>
  kebabcase.replace(/-\w/g, x => x.toUpperCase()?.[1] ?? "");

export const kebabToPascal = (kebabcase: string) =>
  kebabcase.replace(/(^\w|-\w)/g, x => x.replace(/-/, "").toUpperCase());
