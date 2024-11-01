import { eq } from "drizzle-orm";

import type { Session } from "~/domain/entities/session.entity";
import type { User } from "~/domain/entities/user.entity";
import type { SessionRepository } from "~/domain/repositories/session-repository.interface";
import { drizzle } from "~/infrastructure/persistence/database/drizzle";
import { sessions, users } from "~/infrastructure/persistence/database/schemas";
import type { Result } from "~/libs/types";

export class DrizzleSessionRepositoryImpl implements SessionRepository {
  constructor(private readonly db = drizzle) {}

  async create(data: Session): Promise<Result<Session>> {
    const [newSession] = await this.db
      .insert(sessions)
      .values(data)
      .returning();

    if (!newSession) {
      throw new Error("Failed to create session");
    }

    return { success: true, data: newSession };
  }

  async findById(
    id: string,
  ): Promise<Result<({ session: Session } & { user: User }) | null>> {
    const [session] = await this.db
      .select({ session: sessions, user: { id: users.id, email: users.email } })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, id));

    return { success: true, data: session ?? null };
  }

  async update(
    id: string,
    data: Partial<Omit<Session, "id">>,
  ): Promise<Result<Session>> {
    const [updatedSession] = await this.db
      .update(sessions)
      .set(data)
      .where(eq(sessions.id, id))
      .returning();

    if (!updatedSession) {
      throw new Error("Failed to update session");
    }

    return { success: true, data: updatedSession };
  }

  async delete(id: string): Promise<Result<boolean>> {
    const deletedUser = await this.db
      .delete(sessions)
      .where(eq(sessions.id, id))
      .returning();

    return { success: true, data: !!deletedUser };
  }
}
