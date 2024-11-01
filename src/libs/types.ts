export type Result<T, E = string> = Readonly<
  { success: true; data: T } | { success: false; error: E }
>;
