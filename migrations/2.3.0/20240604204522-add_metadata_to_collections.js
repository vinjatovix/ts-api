module.exports = {
  async up(db, client) {
    const session = client.startSession();
    const user = 'adminServiceUser';
    const now = new Date();
    const collections = ['books', 'authors', 'users'];
    try {
      await session.withTransaction(async () => {
        await Promise.all(
          collections.map(async (collection) => {
            await db.collection(collection).updateMany(
              {},
              [
                {
                  $set: {
                    metadata: {
                      createdAt: now,
                      createdBy: user,
                      updatedAt: now,
                      updatedBy: user
                    }
                  }
                }
              ],
              { session }
            );
          })
        );
      });
    } finally {
      session.endSession();
    }
  }
};
