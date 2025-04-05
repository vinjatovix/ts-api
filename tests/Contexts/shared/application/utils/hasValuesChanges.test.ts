import { hasValuesChanges } from '../../../../../src/Contexts/shared/application/utils';

describe('hasValuesChanges', () => {
  it('should return false when objects are identical', () => {
    const request = { name: 'John', age: 30 };
    const storedData = { name: 'John', age: 30 };

    expect(hasValuesChanges(request, storedData)).toBe(false);
  });

  it('should return true when objects have different values', () => {
    const request = { name: 'John', age: 31 };
    const storedData = { name: 'John', age: 30 };

    expect(hasValuesChanges(request, storedData)).toBe(true);
  });

  it('should return true when objects have different keys', () => {
    const request = { name: 'John', age: 30, city: 'New York' };
    const storedData = { name: 'John', age: 30 };

    expect(hasValuesChanges(request, storedData)).toBe(true);
  });

  it('should ignore keys in marginalisedKeys', () => {
    const request = { name: 'John', age: 30, city: 'New York' };
    const storedData = { name: 'John', age: 30, city: 'Los Angeles' };

    expect(hasValuesChanges(request, storedData, ['city'])).toBe(false);
  });

  it('should return true when arrays have different lengths', () => {
    const request = { items: [1, 2, 3] };
    const storedData = { items: [1, 2] };

    expect(hasValuesChanges(request, storedData)).toBe(true);
  });

  it('should return true when array elements are different', () => {
    const request = { items: [1, 2, 3] };
    const storedData = { items: [1, 2, 4] };

    expect(hasValuesChanges(request, storedData)).toBe(true);
  });

  it('should return false when array elements are identical', () => {
    const request = { items: [1, 2, 3] };
    const storedData = { items: [1, 2, 3] };

    expect(hasValuesChanges(request, storedData)).toBe(false);
  });

  it('should handle nested objects correctly', () => {
    const request = { user: { name: 'John', age: 30 } };
    const storedData = { user: { name: 'John', age: 31 } };

    expect(hasValuesChanges(request, storedData)).toBe(true);
  });

  it('should ignore nested keys in marginalisedKeys', () => {
    const request = { user: { name: 'John', age: 30 } };
    const storedData = { user: { name: 'John', age: 31 } };

    expect(hasValuesChanges(request, storedData, ['user.age'])).toBe(false);
  });

  it('should return true when request does not matches storedData.value', () => {
    const request = 'string';
    const storedData = { value: 'differentString' };

    expect(hasValuesChanges(request, storedData)).toBe(true);
  });

  it('should return false when request matches storedData.value', () => {
    const request = 'string';
    const storedData = { value: 'string' };

    expect(hasValuesChanges(request, storedData)).toBe(false);
  });
});
