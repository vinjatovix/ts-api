import Chance from 'chance';

export class Random {
  private chance: Chance.Chance;

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

  public word(length: number = 10): string {
    return this.chance.word({ length });
  }

  public color(options?: Chance.Options): string {
    return this.chance.color(options ?? {});
  }

  public date(options?: Chance.DateOptions): Date {
    const date = this.chance.date(options ?? {});

    return new Date(date);
  }
}