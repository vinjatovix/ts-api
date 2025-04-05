export function hasValuesChanges(
  request: Record<string, unknown> | string | number | boolean,
  storedData: Record<string, unknown>,
  marginalisedKeys: string[] = [],
  parentKey = ''
): boolean {
  const excludedKeys = new Set(['id', ...marginalisedKeys]);

  if (!isObject(request) || !isObject(storedData)) {
    return request !== (storedData?.value ?? storedData);
  }

  if (Array.isArray(request) && Array.isArray(storedData)) {
    return arraysHaveChanges(request, storedData, marginalisedKeys, parentKey);
  }

  return objectsHaveChanges(
    request,
    storedData,
    excludedKeys,
    marginalisedKeys,
    parentKey
  );
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const arraysHaveChanges = (
  request: unknown[],
  storedData: unknown[],
  marginalisedKeys: string[],
  parentKey: string
): boolean => {
  if (request.length !== storedData.length) {
    return true;
  }

  return request.some((item, index) =>
    hasValuesChanges(
      item as Record<string, unknown>,
      storedData[index] as Record<string, unknown>,
      marginalisedKeys,
      `${parentKey}[${index}]`
    )
  );
};

const objectsHaveChanges = (
  request: Record<string, unknown>,
  storedData: Record<string, unknown>,
  excludedKeys: Set<string>,
  marginalisedKeys: string[],
  parentKey: string
): boolean => {
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
};
