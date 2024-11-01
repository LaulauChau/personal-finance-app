export type Session = Readonly<{
  id: string;
  expiresAt: Date;
  userId: string;
}>;
