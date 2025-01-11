import { User } from "./user";

export interface Group {
  id: number;
  name: string;
  createdAt: string;
  admin: User;
  members: number;
}
