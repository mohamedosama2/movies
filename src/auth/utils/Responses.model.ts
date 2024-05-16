import { UserDocument } from 'src/users/models/_user.model';

export interface LoginResponse {
  user: UserDocument;
  token: string;
}
