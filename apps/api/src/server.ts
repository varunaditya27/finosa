import { createServer } from "node:http";
import { createApp } from "./app.ts";
import { loadConfig } from "./infrastructure/config/config.ts";

const config = loadConfig(process.env);
const server = createServer(createApp());

server.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}`);
});
