import TelegramBot from "node-telegram-bot-api";
import { Bot } from "./init";
import { pollPendingMessages } from "./annnounce";
import { getChatId, pollFileUpdates } from "./files";

export function initCommands() {

  console.log("commands");

  Bot.addListener("message", async (msg) => {

    try {
      if(msg.chat.type !== "private") {
        if(msg.text?.startsWith("/getchatid"))
          return await getChatId(msg);
        return;
      };
      if(msg.text?.startsWith("/start"))
        return await startCommand(msg);
      if(msg.text?.startsWith("/poll"))
        return await pollFileUpdates();
    } catch (err) {
      console.log(err);
    }

  });

}

export async function startCommand(msg: TelegramBot.Message) {

  await Bot.sendMessage(msg.chat.id, String(msg.from?.id) + " " + String(msg.chat.id));

}