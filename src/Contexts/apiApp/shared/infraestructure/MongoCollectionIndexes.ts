export const INDEXES = [
  { collection: 'books', indexes: [['title', 'author']] },
  { collection: 'characters', indexes: [['name', 'book']] }
];
