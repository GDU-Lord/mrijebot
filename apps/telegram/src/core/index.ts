import TelegramBot from "node-telegram-bot-api";
import { InputListener } from "./input";
import { ProcedureListener } from "./on";

export let Bot: TelegramBot;
export let inputListener: InputListener;
export let procedureListener: ProcedureListener;

let resolver: ((val: void) => void) | null = null;
export let initPromise = new Promise<void>((res) => {
  resolver = res;
});

export function init(token: string, options: TelegramBot.ConstructorOptions) {
  Bot = new TelegramBot(token, options);
  inputListener = new InputListener;
  procedureListener = new ProcedureListener;
  if(resolver) 
    resolver();
  else
    throw "Initiation error!";
}