import validate from "validate-npm-package-name";

export const validateNpmPackage = (
  packageName: string,
): { isValid: true } | { isValid: false; issues: string[] } => {
  const validation = validate(packageName);

  if (validation.validForNewPackages) return { isValid: true };

  return {
    isValid: false,
    issues: [...(validation.errors ?? []), ...(validation.warnings ?? [])],
  };
};
