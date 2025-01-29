import { on } from "../core/chain.js";
import { initPromise } from "../core/index.js";
import { match } from "../custom/hooks.js";

export function ping() {
  on("message", match("ping"))
    .send("pong");
}