import { pollPendingMessages } from "./annnounce";
import { initCommands } from "./commands";
import { initQueueLoop } from "./cooldown";
import { pollFileUpdates } from "./files";
import { init } from "./init";

async function bootstrap() {

  initQueueLoop();
  init();
  initCommands();
  
  console.log("connected");

  setInterval(async () => {
    await pollFileUpdates();
    await pollPendingMessages();
  }, 2000);

}

bootstrap();