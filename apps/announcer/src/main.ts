import { pollPendingMessages } from "./annnounce";
import { initCommands } from "./commands";
import { pollFileUpdates } from "./files";
import { init } from "./init";

async function bootstrap() {
  
  init();
  initCommands();
  
  console.log("connected");

  setInterval(async () => {
    await pollFileUpdates();
    await pollPendingMessages();
  }, 2000);

}

bootstrap();
