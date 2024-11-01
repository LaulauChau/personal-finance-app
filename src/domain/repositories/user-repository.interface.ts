import type { User, UserWithPassword } from "~/domain/entities/user.entity";
import type { Result } from "~/libs/types";

export type UserRepository = Readonly<{
  create: (data: Omit<UserWithPassword, "id">) => Promise<Result<User>>;

  findByEmail: (email: string) => Promise<Result<User | null>>;
}>;
