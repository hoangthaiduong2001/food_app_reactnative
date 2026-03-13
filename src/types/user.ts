export type UserType = "user" | "admin";

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: UserType;
}
