import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";

import type { AuthService } from "~/application/services/auth-service.interface";
import type { Session } from "~/domain/entities/session.entity";
import type { User } from "~/domain/entities/user.entity";
import type { SessionRepository } from "~/domain/repositories/session-repository.interface";
import type { Result } from "~/libs/types";

export class OsloAuthServiceImpl implements AuthService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async createSession(token: string, userId: string): Promise<Result<Session>> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );
    const session: Session = {
      id: sessionId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      userId,
    };

    const result = await this.sessionRepository.create(session);

    if (!result.success) {
      throw new Error("Failed to create session");
    }

    return result;
  }

  generateSessionToken(): Result<string> {
    const bytes = new Uint8Array(20);

    crypto.getRandomValues(bytes);

    const token = encodeBase32LowerCaseNoPadding(bytes);

    return { success: true, data: token };
  }

  async invalidateSession(sessionId: string): Promise<Result<boolean>> {
    const result = await this.sessionRepository.delete(sessionId);

    if (!result.success) {
      throw new Error("Failed to delete session");
    }

    return result;
  }

  async validateSessionToken(
    token: string,
  ): Promise<
    Result<{ session: Session; user: User } | { session: null; user: null }>
  > {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );
    const sessionResult = await this.sessionRepository.findById(sessionId);

    if (!sessionResult.success || !sessionResult.data) {
      throw new Error("Failed to find session");
    }

    const { session, user } = sessionResult.data;

    if (Date.now() >= session.expiresAt.getTime()) {
      await this.sessionRepository.delete(sessionId);

      return { success: true, data: { session: null, user: null } };
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      const updatedSession: Session = {
        ...session,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      };

      await this.sessionRepository.update(sessionId, updatedSession);

      return { success: true, data: { session: updatedSession, user } };
    }

    return { success: true, data: { session, user } };
  }
}
