import { CHAIN } from "./core/actions.js";
import { on, procedure } from "./core/chain.js";
import { init, Bot, procedureListener } from "./core/index.js";
import "dotenv/config.js";
import { buttonCallback, createButtons } from "./custom/hooks.js";
import { LocalState } from "./core/state.js";
import TelegramBot from "node-telegram-bot-api";

init(process.env.TOKEN as string, {
  polling: {
    interval: 2000,
    params: {
      allowed_updates: ["chat_member", "message", "chat_join_request", "callback_query", "chat_member_updated"]
    }
  }
});

console.log("connected");

on("message", inp => inp.text === "roll")
  .send('Rolling d20...')
  .send(async state => {
    const n = Math.floor(Math.random() * 20) + 1;
    return `Roll result: ${n}`;
  });

interface rollData {
  d20: number;
  d2: number;
  fails: number;
  killed: number;
  successes: number;
}

const getSurname = procedure();

getSurname.make()
  .send("Enter your surname:")
  .input('SURNAME')
  .send("Thanks, your surname is {core.inputs.SURNAME.text}!")
  .func(async state => {
    state.resolveProcedure(getSurname, state.core.inputs.SURNAME!.text);
  });

on("message", inp => inp.text === "/roll")
  .send('Rolling dice...')
  .func<rollData>(async state => {
    if(typeof state.data !== "object")
      state.data = {} as rollData;
    if(state.data.fails == null) state.data.fails = 0;
    if(state.data.successes == null) state.data.successes = 0;
    state.data.d20 = Math.floor(Math.random() * 20) + 1;
    state.data.d2 = Math.floor(Math.random() * 2) + 1;
  })
  .send("d20 = {data.d20}\nd2 = {data.d2}")
  .check<rollData>(async state => {
    if(state.data.d20 >= 10) return "win";
    else return "lose";
  })
    .funcCase<rollData>("win", async state => {
      state.data.successes ++;
    })
    .funcCase<rollData>("lose", async state => {
      state.data.fails ++;
      state.data.killed = 0;
    })
    .checkNest<rollData>("win", async state => {
      return state.data.d2;
    })
      .funcCase<rollData>(2, async state => {
        state.data.killed = state.data.d20;
      })
      .funcCase<rollData>(1, async state => {
        state.data.killed = Math.floor(state.data.d20 / 4);
      })
    .endNest
  .endCase
  .send<rollData>(async state => {
    const text = state.data.d20 >= 10 ? 'Success!' : 'Fail!';
    const killed = state.data.killed > 0 ? 'You just killed {data.killed} more goblins!' : '';
    return `${text} ${killed}\nFails: {data.fails}\nSuccesses: {data.successes}`;
  });


on("message", inp => inp.text!.includes("quote"))
  .send('Your message was: {lastInput.text}');


on("message", inp => inp.text === "ping")
  .send('pong {core.chatId}');


on("message", inp => inp.text === "array")
  .func<number[]>(async state => {
    state.data = [1,2,3];
  })
  .send("Numbers: {data.1} {data.2} {data.0}");


on("message", inp => inp.text === "userid")
  .send("Your Telegarm userID is '{core.userId}'");

on("message", inp => inp.text === "name")
  .send("Enter your name:")
  .input('NAME')
  .send("Thanks! Your name is {core.inputs.NAME.text}. How old are you?")
  .input('AGE')
  .func<{ surname: string }>(async (state) => {
    if(typeof state.data !== "object")
      state.data = {} as { surname: string };
    state.data.surname = await state.call(getSurname);
  })
  .send("Are you really {core.inputs.NAME.text} {data.surname} and {core.inputs.AGE.text} years old?");

on("message", inp => inp.text === "case")
  .send("Enter 'a' or 'b'")
  .input('LETTER')
  .send("Enter a word")
  .input('WORD')
  .check(async state => {
    return state.core.inputs.LETTER!.text;
  })
    .sendCase('a', "Your letter is A, enter a new word")
    .sendCase('b', "Your letter is B, it's over for you")
    .inputCase('a', 'WORD')
  .endCase
  .send('Your word was {core.inputs.WORD.text}')

const forWord = procedure(); // create procedure

forWord.make()
  .input('WORD')
  .check(async state => {
    const word = state.core.inputs.WORD?.text;
    return word != null && word.length >= 1 && word.length <= 4;
  })
    .sendCase(true, async state => {
      await state.cache(forWord, async cache => {
        cache.word = state.core.inputs.WORD; // caching
      });
      return 'Thank you!';
    })
    .sendCase(false, 'The length of the word is incorrect!')
    .funcCase(false, async state => {
      await state.cache(forWord, async cache => {
        if(cache.word == null)
          cache.word = await state.call(forWord, "push"); // recursion call and caching of the answer
      });
    })
  .endCase
  .func(async state => {
    await state.cache(forWord, async cache => {
      state.resolveProcedure(forWord, cache.word); // return
    });
  });

on("message", inp => inp.text === "short word") // respond to message
  .send("Enter a word that's from 1 to 4 letters long")
  .send(async state => {
    return "Your word was " + (await state.call(forWord)).text; // injection
  });

const buttons = createButtons([
  [
    ["B1", 1],
    ["B2", 2],
    ["B3", 3]
  ],
  [
    ["B4", 4],
    ["B5", 5],
    ["B6", 6]
  ],
]);

const buttons2 = createButtons([
  [
    ["C1", 1],
    ["C2", 2],
  ]
]);

on("message", inp => inp.text === "keys")
  .send("Choose a number!", buttons.get)
  .func(async (state) => {
    if(!state.data) state.data = {};
    state.data.MESSAGE_ID = (state.lastMessageSent as TelegramBot.Message).message_id;
  });

on("message", inp => inp.text === "k2")
  .send("Choose a number! (page 2)", buttons2.get);

on("callback_query", buttonCallback(data => true, buttons))
  .func(async state => {
    try {
      await Bot.deleteMessage(state.core.chatId, state.data.MESSAGE_ID);
    } catch {}
  })
  .send("got it!");

on("callback_query", buttonCallback(data => true, buttons2))
  .send("got it 2!");