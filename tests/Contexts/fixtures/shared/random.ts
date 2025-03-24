import Chance from 'chance';

export class Random {
  private readonly chance: Chance.Chance;

  constructor() {
    this.chance = new Chance();
  }

  public arrayElement(array: unknown[] = []): unknown {
    return this.chance.pickone(array);
  }

  public boolean(): boolean {
    return this.chance.bool();
  }

  public description(words: number = 5, toLowerCase: boolean = false): string {
    const description = this.chance.sentence({ words });
    return toLowerCase ? description.toLowerCase() : description;
  }

  public integer(options?: Chance.IntegerOptions): number {
    return this.chance.integer(options ?? {});
  }

  public name(toLowerCase: boolean = false): string {
    const name = this.chance.sentence().replace(/\s|\./g, '-');

    return toLowerCase ? name.toLowerCase() : name;
  }

  public uuid(isV4: boolean = true): string {
    return this.chance.guid({ version: isV4 ? 4 : 5 });
  }

  public url(): string {
    return this.chance.url();
  }

  public word({
    min = 0,
    max = 256
  }: { min?: number; max?: number } = {}): string {
    return this.chance.word({
      length: Math.floor(Math.random() * (max - min + 1) + min)
    });
  }

  public color(options?: Chance.Options): string {
    return this.chance.color(options ?? {});
  }

  public date(options?: Chance.DateOptions): Date | string {
    const date = this.chance.date(options ?? {});

    return new Date(date);
  }

  public isbn(): string {
    const prefix = this.arrayElement(['978', '979']);
    const group1 = this.integer({ min: 0, max: 9 });
    const group2 = this.integer({ min: 10, max: 99 });
    const group3 = this.integer({ min: 100000, max: 999999 });
    const group4 = this.integer({ min: 0, max: 9 });

    return `${prefix}-${group1}-${group2}-${group3}-${group4}`;
  }

  public email(): string {
    return this.chance.email();
  }
}
