export function getString(env: string): string {
  const variable = process.env[env];
  if (variable === undefined) {
    throw new Error(`Missing required variable ${env}`);
  }
  return variable;
}

export const config = {
  port: Number(getString("PORT")),
  dataFile: getString("DATA_FILE"),
} as const;
