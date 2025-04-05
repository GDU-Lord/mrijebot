import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";

export let Bot: TelegramBot;

export const defeaultMessageOptions = {
  parse_mode: "HTML"
} as TelegramBot.SendMessageOptions;

export function init() {

  Bot = new TelegramBot(process.env.ANNOUNCER_TOKEN!, {
    polling: {
      interval: 500,
      params: {
        allowed_updates: ["chat_member", "message", "chat_join_request", "callback_query", "chat_member_updated"]
      }
    }
  });
  
}