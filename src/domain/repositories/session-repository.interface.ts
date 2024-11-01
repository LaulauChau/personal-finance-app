import type { Session } from "~/domain/entities/session.entity";
import type { User } from "~/domain/entities/user.entity";
import type { Result } from "~/libs/types";

export type SessionRepository = Readonly<{
  create: (data: Session) => Promise<Result<Session>>;

  findById: (
    id: string,
  ) => Promise<Result<({ session: Session } & { user: User }) | null>>;

  update: (
    id: string,
    data: Partial<Omit<Session, "id">>,
  ) => Promise<Result<Session>>;

  delete: (id: string) => Promise<Result<boolean>>;
}>;
