import { afterInit } from "./afterInit";
import { initCommands } from "./commands/index";
import "dotenv/config";
import { init } from "./core/index";

async function bootstrap() {
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
}
bootstrap();
