import fs from 'fs';
import { deserialize, serialize } from 'bson';
import { Book } from '../../domain/Book';
import { BookRepository } from '../../domain/BookRepository';

export class FileBookRepository implements BookRepository {
  private FILE_PATH = `${process.cwd()}/fileDb/`;
  private FILE_PREFIX = 'Books';

  async save(book: Book): Promise<void> {
    await fs.promises.writeFile(
      this.filePath(`${book.id.value}`),
      serialize(book)
    );
  }

  async search(bookId: string): Promise<Book | null> {
    try {
      const bookData = await fs.promises.readFile(this.filePath(bookId));

      const { id, title, author, isbn, releaseDate, pages } =
        deserialize(bookData);

      return new Book({ id, title, author, isbn, releaseDate, pages });
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<Book[]> {
    const books: Book[] = [];
    const files = (await fs.promises.readdir(`${this.FILE_PATH}`)).filter(
      (file) => file.startsWith(this.FILE_PREFIX)
    );

    for (const file of files) {
      const bookData = await fs.promises.readFile(`${this.FILE_PATH}${file}`);

      const { id, title, author, isbn, releaseDate, pages } =
        deserialize(bookData);

      books.push(new Book({ id, title, author, isbn, releaseDate, pages }));
    }

    return books;
  }

  async remove(bookId: string): Promise<void> {
    try {
      await fs.promises.unlink(this.filePath(bookId));
    } catch (error) {
      return;
    }
  }

  private filePath(id: string): string {
    return `${this.FILE_PATH}${this.FILE_PREFIX}.${id}.repo`;
  }
}
