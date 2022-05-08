export function replaceAt(
    str: string,
    replacement: string,
    index: number,
    length = 0
  ) {
    const prefix = str.substring(0, index);
    const suffix = str.substring(index + length);
  
    return prefix + replacement + suffix;
  }
  