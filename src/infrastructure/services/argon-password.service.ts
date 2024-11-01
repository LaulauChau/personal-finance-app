import { type Options, hash, verify } from "@node-rs/argon2";

import type { PasswordService } from "~/application/services/password-service.interface";
import type { Result } from "~/libs/types";

export class ArgonPasswordServiceImpl implements PasswordService {
  private readonly options: Options = {
    memoryCost: 19456,
    outputLen: 32,
    parallelism: 1,
    timeCost: 2,
  };

  async hash(plainPassword: string): Promise<Result<string>> {
    const hashedPassword = await hash(plainPassword, this.options);

    return { success: true, data: hashedPassword };
  }

  async verify(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<Result<boolean>> {
    const isMatch = await verify(hashedPassword, plainPassword, this.options);

    return { success: true, data: isMatch };
  }
}
