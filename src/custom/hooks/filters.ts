import TelegramBot from "node-telegram-bot-api";
import { LocalState } from "../../core/state.js";
import { procedure } from "../../core/chain.js";

export function match(text: string) {
  return (inp: TelegramBot.Message) => inp.text === text;
}

export function command(com: string) {
  return (inp: TelegramBot.Message) => inp.text!.startsWith(com);
}