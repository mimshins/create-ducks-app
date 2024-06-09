import * as FS from "node:fs";

export const isWriteable = async (directory: string) => {
  try {
    await FS.promises.access(directory, (FS.constants ?? FS).W_OK);

    return true;
  } catch {
    return false;
  }
};
