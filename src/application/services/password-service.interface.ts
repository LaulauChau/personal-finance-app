import type { Result } from "~/libs/types";

export type PasswordService = Readonly<{
  hash: (plainPassword: string) => Promise<Result<string>>;

  verify: (
    plainPassword: string,
    hashedPassword: string,
  ) => Promise<Result<boolean>>;
}>;
