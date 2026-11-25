import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
});

export type Config = z.infer<typeof schema>;

export function loadConfig(env: NodeJS.ProcessEnv): Config {
  return schema.parse(env);
}
