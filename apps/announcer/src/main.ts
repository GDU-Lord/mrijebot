import { pollPendingMessages } from "./annnounce";
import { initCommands } from "./commands";
import { init } from "./init";

async function bootstrap() {
  
  init();
  initCommands();
  
  console.log("connected");

  setInterval(() => {
    // pollPendingMessages();
  }, 2000);

}

bootstrap();
