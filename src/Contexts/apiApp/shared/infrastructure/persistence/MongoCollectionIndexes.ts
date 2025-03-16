export const INDEXES = [
  { collection: 'users', indexes: [['email'], ['username']] },
  { collection: 'books', indexes: [['title', 'author']] },
  { collection: 'characters', indexes: [['name', 'book']] }
];
