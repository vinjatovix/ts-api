import container from '../../../../../../src/apps/apiApp/dependency-injection';
import { UserRepository } from '../../../../../../src/Contexts/apiApp/Auth/domain/UserRepository';

import { EnvironmentArranger } from '../../../../shared/infrastructure/arranger/EnvironmentArranger';
import { UserMother } from '../../domain/mothers';

const repository: UserRepository = container.get(
  'apiApp.Auth.domain.AuthRepository'
);

const environmentArranger: Promise<EnvironmentArranger> = container.get(
  'apiApp.EnvironmentArranger'
);

describe('MongoAuthRepository', () => {
  beforeEach(async () => {
    await (await environmentArranger).arrange();
  });

  afterAll(async () => {
    await (await environmentArranger).arrange();
    await (await environmentArranger).close();
  });

  describe('save', () => {
    it('should save a user', async () => {
      const user = UserMother.random();

      await repository.save(user);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const user = UserMother.random();
      await repository.save(user);
      const userPatch = UserMother.randomPatch(user.id.value);

      await repository.update(userPatch);

      expect(await repository.search(user.email.value)).toMatchObject(
        userPatch
      );
    });
  });

  describe('search', () => {
    it('should return an existing user', async () => {
      const user = UserMother.random();

      await repository.save(user);

      expect(await repository.search(user.email.value)).toMatchObject(user);
    });

    it('should not return a non existing user', async () => {
      expect(await repository.search(UserMother.random().email.value)).toBe(
        null
      );
    });
  });
});
