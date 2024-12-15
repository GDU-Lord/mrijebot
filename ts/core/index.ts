import TelegramBot from "node-telegram-bot-api";
import { InputListener } from "./input.js";
import { ProcedureListener } from "./on.js";

export let Bot: TelegramBot;
export let inputListener: InputListener;
export let procedureListener: ProcedureListener;

export function init(token: string, options: TelegramBot.ConstructorOptions) {
  Bot = new TelegramBot(token, options);
  inputListener = new InputListener;
  procedureListener = new ProcedureListener;
}