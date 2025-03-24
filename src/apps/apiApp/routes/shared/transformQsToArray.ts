import { ParsedQs } from 'qs';

export const transformQsToArray = (
  value: string | ParsedQs | string[] | ParsedQs[] | undefined
): string[] | undefined => {
  if (typeof value === 'string') {
    return value.split(',');
  }
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string');
  }

  return undefined;
};
