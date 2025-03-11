export function hasValuesChanges(
  request: Record<string, unknown>,
  storedData: Record<string, unknown>,
  marginalisedKeys: string[] = [],
  parentKey = ''
): boolean {
  const excludedKeys = new Set(['id', ...marginalisedKeys]);

  if (
    typeof request !== 'object' ||
    typeof storedData !== 'object' ||
    request === null ||
    storedData === null
  ) {
    const data = storedData.value ? storedData.value : storedData;
    return request !== data;
  }

  for (const key of Object.keys(request)) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (excludedKeys.has(fullKey)) {
      continue;
    }

    if (
      !(key in storedData) ||
      hasValuesChanges(
        request[key] as Record<string, unknown>,
        storedData[key] as Record<string, unknown>,
        marginalisedKeys,
        fullKey
      )
    ) {
      return true;
    }
  }

  return false;
}
