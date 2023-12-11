import { BookRepository } from '../domain';

import { BookResponse } from './BookResponse';

export class AllBooksFinder {
  private readonly repository: BookRepository;

  constructor(repository: BookRepository) {
    this.repository = repository;
  }

  async run(): Promise<BookResponse[]> {
    const books = await this.repository.findAll();

    return books.map((book) => ({
      id: book.id.value,
      title: book.title.value,
      author: book.author.value,
      isbn: book.isbn.value,
      releaseDate: book.releaseDate.value,
      pages: book.pages.value
    }));
  }
}
