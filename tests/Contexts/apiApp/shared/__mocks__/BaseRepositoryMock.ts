import { RequestOptions } from '../../../../../src/apps/apiApp/shared/interfaces';
import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';

export abstract class BaseRepositoryMock<T, TT, Q> {
  protected storage: T[];
  protected readonly saveMock: jest.Mock;
  protected readonly updateMock: jest.Mock;
  private readonly removeMock: jest.Mock;
  private readonly findAllMock: jest.Mock;
  protected readonly findMock: jest.Mock;
  private readonly findByQueryMock: jest.Mock;
  protected isFindable: boolean;

  constructor(
    { find = false }: { find?: boolean } = { find: false },
    initialData: T[]
  ) {
    this.isFindable = find;
    this.storage = initialData;
    this.saveMock = jest.fn();
    this.updateMock = jest.fn();
    this.removeMock = jest.fn();
    this.findAllMock = jest.fn(() => (this.isFindable ? this.storage : []));
    this.findMock = jest.fn((id: string) => {
      const foundItem = this.storage.find((item) => this.getId(item) === id);
      return this.isFindable ? (foundItem ?? this.storage[0]) : foundItem;
    });
    this.findByQueryMock = jest.fn((query: Q) =>
      this.defaultFindByQuery(query)
    );
  }

  protected abstract getId(item: T): string;
  protected abstract defaultFindByQuery(query: Q): T[];

  async save(item: T): Promise<void> {
    this.saveMock(item);
  }

  assertSaveHasBeenCalledWith(expected: T): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  async update(item: TT, username: Username): Promise<void> {
    this.updateMock(item as Partial<T>, username);
  }

  assertUpdateHasBeenCalledWith(
    expected: Partial<T>,
    username: Username
  ): void {
    expect(this.updateMock).toHaveBeenCalledWith(expected, username);
  }

  async remove(id: string): Promise<void> {
    this.removeMock(id);
  }

  assertRemoveHasBeenCalledWith(expected: string): void {
    expect(this.removeMock).toHaveBeenCalledWith(expected);
  }

  async findAll(options: RequestOptions): Promise<T[]> {
    return this.findAllMock(options);
  }

  assertFindAllHasBeenCalled(): void {
    expect(this.findAllMock).toHaveBeenCalled();
  }

  assertFindAllHasBeenCalledWith(expected: RequestOptions): void {
    expect(this.findAllMock).toHaveBeenCalledWith(expected);
  }

  async search(id: string): Promise<T | null> {
    return this.findMock(id);
  }

  assertSearchHasBeenCalledWith(expected: string): void {
    expect(this.findMock).toHaveBeenCalledWith(expected);
  }

  async findByQuery(query: Q): Promise<T[]> {
    return this.findByQueryMock(query);
  }

  assertFindByQueryHasBeenCalledWith(expected: Q): void {
    expect(this.findByQueryMock).toHaveBeenCalledWith(expected);
  }

  setFindable(findable: boolean): void {
    this.isFindable = findable;
  }

  addToStorage(item: T): void {
    this.storage.push(item);
  }
}
