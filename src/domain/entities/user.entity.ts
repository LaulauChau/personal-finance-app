export type User = Readonly<{
  id: string;
  email: string;
}>;

export type UserWithPassword = User & Readonly<{ password: string }>;
