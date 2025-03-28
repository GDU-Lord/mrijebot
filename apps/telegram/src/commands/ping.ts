import { on } from "../core/chain";
import { initPromise } from "../core/index";
import { match } from "../custom/hooks/filters";

export function ping() {
  on("message", match("ping"))
    .send("pong");
}