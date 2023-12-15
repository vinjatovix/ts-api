import { User } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { UserMother } from './mothers/UserMother';

describe('User', () => {
  it('should create a valid user', () => {
    const user = UserMother.create();

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.password).toBeDefined();
    expect(user.emailValidated).toBeDefined();
    expect(user.roles).toBeDefined();
  });

  it('should return primitives from user', () => {
    const user = UserMother.random();

    const primitives = user.toPrimitives();

    expect(primitives).toMatchObject({
      id: expect.any(String),
      email: expect.any(String),
      username: expect.any(String),
      password: expect.any(String),
      emailValidated: expect.any(Boolean),
      roles: expect.any(Array)
    });
  });

  it('should create a valid user from primitives', () => {
    const user = UserMother.random();

    const userFromPrimitives = User.fromPrimitives(
      user.toPrimitives() as {
        id: string;
        email: string;
        username: string;
        password: string;
        emailValidated: boolean;
        roles: string[];
      }
    );

    expect(userFromPrimitives).toBeInstanceOf(User);
    expect(userFromPrimitives).toEqual(user);
  });
});
