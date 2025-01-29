import { on } from "../core/chain.js";
import { initPromise } from "../core/index.js";
import { buttonCallbackValue, call, command } from "../custom/hooks.js";
import { $info } from "./info.js";
import { ping } from "./ping.js";
import { $start, startButtons } from "./start.js";

export async function initCommands() {

  await initPromise;
  
  ping();

  on("message", command("/start")).func(call($start));

}