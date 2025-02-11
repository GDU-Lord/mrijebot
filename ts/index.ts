import { init } from "./core/index.js";
import "dotenv/config.js";
import { initCommands } from "./commands/index.js";
import { afterInit } from "./afterInit.js";

init(process.env.TOKEN as string, {
  polling: {
    interval: 2000,
    params: {
      allowed_updates: ["chat_member", "message", "chat_join_request", "callback_query", "chat_member_updated"]
    }
  }
});

console.log("connected");

initCommands();

afterInit.forEach(func => func());