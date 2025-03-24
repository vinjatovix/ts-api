import { LoginUserRequest } from './LoginUserRequest';

export interface RegisterUserRequest extends LoginUserRequest {
  id: string;
  username: string;
  repeatPassword?: string;
}
