import { LoginUserRequest } from './LoginUserRequest';

export interface RegisterUserRequest extends LoginUserRequest {
  username: string;
}
