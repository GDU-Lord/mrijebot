import TelegramBot from "node-telegram-bot-api";
import { Bot } from "./init";
import { pollPendingMessages, pollPendingRequests } from "./annnounce";

export function initCommands() {

  console.log("commands");

  Bot.addListener("message", async (msg) => {

    try {
      if(msg.chat.type !== "private") return;
      if(msg.text?.startsWith("/start"))
        return await startCommand(msg);
      if(msg.text?.startsWith("/poll"))
        return await pollPendingRequests();
    } catch (err) {
      console.log(err);
    }

  });

}

export async function startCommand(msg: TelegramBot.Message) {

  await Bot.sendMessage(msg.chat.id, String(msg.from?.id) + " " + String(msg.chat.id));

}