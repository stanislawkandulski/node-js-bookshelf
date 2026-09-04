import { buildApp } from "./app.ts";
import { config } from "./config.ts";

const app = buildApp();
await app.listen({ port: config.port });
console.log(`http://localhost:${config.port}`);
