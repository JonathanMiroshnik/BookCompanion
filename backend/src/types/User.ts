export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  pictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  googleId: string;
  email: string;
  name: string;
  pictureUrl?: string;
}

export interface UpdateUserData {
  name?: string;
  pictureUrl?: string;
}
