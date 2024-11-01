import type { Session } from "~/domain/entities/session.entity";
import type { User } from "~/domain/entities/user.entity";
import type { Result } from "~/libs/types";

export type AuthService = Readonly<{
  createSession: (token: string, userId: string) => Promise<Result<Session>>;

  generateSessionToken: () => Result<string>;

  invalidateSession: (sessionId: string) => Promise<Result<boolean>>;

  validateSessionToken: (
    token: string,
  ) => Promise<
    Result<{ session: Session; user: User } | { session: null; user: null }>
  >;
}>;
