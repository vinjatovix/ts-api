db = db.getSiblingDB('ts-api');
db.createUser({
  user: 'localUser',
  pwd: 'localPassword',
  roles: [{ role: 'readWrite', db: 'ts-api' }]
});

db = db.getSiblingDB('test');
db.createUser({
  user: 'localUser',
  pwd: 'localPassword',
  roles: [
    { role: 'readWrite', db: 'test' }
  ]
});
