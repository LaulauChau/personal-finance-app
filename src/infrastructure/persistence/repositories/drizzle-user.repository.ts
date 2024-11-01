import { eq } from "drizzle-orm";

import type { User, UserWithPassword } from "~/domain/entities/user.entity";
import type { UserRepository } from "~/domain/repositories/user-repository.interface";
import { drizzle } from "~/infrastructure/persistence/database/drizzle";
import { users } from "~/infrastructure/persistence/database/schemas";
import type { Result } from "~/libs/types";

export class DrizzleUserRepositoryImpl implements UserRepository {
  constructor(private readonly db = drizzle) {}

  async create(data: Omit<UserWithPassword, "id">): Promise<Result<User>> {
    const [newUser] = await this.db.insert(users).values(data).returning({
      id: users.id,
      email: users.email,
    });

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    return { success: true, data: newUser };
  }

  async findByEmail(email: string): Promise<Result<User | null>> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return { success: true, data: user ?? null };
  }
}
