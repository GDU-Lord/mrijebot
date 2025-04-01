import TelegramBot from "node-telegram-bot-api";
import { on } from "../core/chain";
import { Bot, initPromise } from "../core/index";
import { ping } from "./ping";
import { $start } from "./start";
import { command } from "../custom/hooks/filters";
import { call } from "../custom/hooks/menu";
import { afterInit } from "../afterInit";
import { $setup, initDefault } from "./default";
import { $createLand, $createSystem, $auth, $wizard } from "./wizard";
import { createButtons } from "../custom/hooks/buttons";
import { $createRole, $getRole } from "./wizard/roles";
import { initState } from "../custom/hooks/state";

afterInit.push(initDefault);

export async function initCommands() {

  await initPromise;
  
  ping();

  // const restartButton = createButtons([
  //   [["RESTART", "RESTART"]]
  // ]);

  on("message", command("/start")).func(call($setup));

  // wizard commands
  on("message", command("/auth")).func(initState()).func(call($auth));
  on("message", command("/admin")).func(initState()).func(call($wizard));
  on("message", command("/addland")).func(initState()).func(call($createLand));
  on("message", command("/addsystem")).func(initState()).func(call($createSystem));
  on("message", command("/addrole")).func(initState()).func(call($createRole));
  on("message", command("/getrole")).func(initState()).func(call($getRole));

  // timeout message removal
  on("message", () => true).func(async state => {
    const msg = state.lastInput as TelegramBot.Message;
    setTimeout(async () => {
      try {
        await Bot.deleteMessage(msg.chat.id, msg.message_id);
      } catch {}
    }, 2000);
  });

}