interface PublicUser {
  id: string;
  name: string;
}

interface PrivateUser extends PublicUser {
  email: string;
  password: string;
}

interface CreatedUser {
  name: string;
  email: string;
  password: string;
}

export type { PublicUser, PrivateUser, CreatedUser };