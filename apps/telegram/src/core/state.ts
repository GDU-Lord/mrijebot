import TelegramBot from "node-telegram-bot-api";
import { inputType, procedure } from "./chain";
import { ProcedureListener } from "./on";
import { procedureListener } from "./index";

export type userId = number;

export class UserState<dataType = any> {

  static list: {
    [key: userId]: UserState;
  } = {};

  localStates: {
    [key: TelegramBot.ChatId]: LocalState
  } = {};

  core: {
    userId: userId
  };

  declare data: dataType;

  constructor(
    userId: userId
  ) {
    this.core = { userId };
    UserState.list[this.core.userId] = this;
  }

  getLocalState(chatId: TelegramBot.ChatId, threadId: number) {
    return this.localStates[chatId + ":" + threadId];
  }

}

export class LocalState<dataType = any, userDataType = any> {

  core: {
    chatId: TelegramBot.ChatId;
    threadId: number;
    userId: userId;
    userState: UserState<userDataType>;
    inputs: {
      [key: string]: TelegramBot.Message | undefined
    };
    procedures: {
      [key: string]: {
          resolve: (data: any) => void;
          cache: {
            index: number | null;
            [key: string]: any;
          }
        }[];
    };
  };

  resolveProcedure<T = any>({ id }: procedure, data?: T, singleCall: boolean = true, index: number | null = null) {
    if(id in this.core.procedures) {
      if(index === null) {
        for(const i in this.core.procedures[id]) {
          this.core.procedures[id][i].resolve(data);
          if(singleCall)
            delete this.core.procedures[id][i];
        }
      }
      else {
        this.core.procedures[id][index].resolve(data);
        if(singleCall)
          delete this.core.procedures[id][index];
      }
    }
  }

  call({ id }: procedure, index: number | "push" = 0) {
    return procedureListener.call(id, this, index === "push" ? undefined : index);
  }

  async cache({ id}: procedure, callback: (cache: LocalState['core']['procedures'][0][0]['cache']) => Promise<LocalState['core']['procedures'][0][0]['cache'] | void>, index : number | null = null) {
    if(id in this.core.procedures) {
      if(index == null) {
        for(const i in this.core.procedures[id]) {
          const res = await callback(this.core.procedures[id][i].cache);
          if(i in this.core.procedures[id])
            this.core.procedures[id][i].cache = res ?? this.core.procedures[id][i].cache;
        }
      }
      else {
        const res = await callback(this.core.procedures[id][index].cache);
        if(index in this.core.procedures[id])
          this.core.procedures[id][index].cache = res ?? this.core.procedures[id][index].cache;
      }
    }
  }

  declare data: dataType;
  declare lastInput: inputType;
  declare lastMessageSent: TelegramBot.Message

  constructor(chatId: TelegramBot.ChatId, threadId: number, userId: userId) {
    this.core = {
      userState: UserState.list[userId],
      inputs: {},
      procedures: {},
      chatId, userId, threadId
    };
    this.core.userState.localStates[this.core.chatId + ":" + this.core.threadId] = this;
  }

}