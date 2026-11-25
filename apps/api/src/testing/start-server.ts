import { createServer, type RequestListener } from "node:http";
import type { AddressInfo } from "node:net";

export async function startServer(listener: RequestListener) {
  const server = createServer(listener);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const { port } = server.address() as AddressInfo;
  return {
    baseUrl: `http://localhost:${port}`,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}
