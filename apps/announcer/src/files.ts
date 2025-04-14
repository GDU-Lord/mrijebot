import * as fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import { Bot } from "./init";
import { env } from "process";
import "dotenv/config";
import { api } from "./api";
import { UpdateAnnouncementDto } from "../../core/src/controllers/announcement/dtos/update-announcement.dto";

export async function pollFileUpdates() {

  fs.readdir("./cache/img", async (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
    } else if (files.length > 0) {
      for(const file of files) {
        await cacheImageId(file);
        await new Promise((res, rej) => fs.rm("./cache/img/" + file, res));
      }
    }
  });

}

export async function cacheImageId(filename: string) {

  try {
    const [announcementId, oldId] = filename.split("__");

    const imageBuffer = fs.readFileSync("./cache/img/" + filename);
  
    const res = await Bot.sendPhoto(process.env.BOT_CACHE_CHAT_ID!, imageBuffer);
  
    const p = res.photo?.[res.photo?.length-1] ?? null;
    if(!p) return;
    const photo = {
      id: p.file_id,
      uid: p.file_unique_id,
    };
  
    const data: UpdateAnnouncementDto = {
      data: {
        photo
      },
      status: "pending"
    };
  
    await api.put("/announcements/" + announcementId, data, {}, err => console.log(err));
  
  } catch (err) {
    console.log(err);
  }

  
}

export async function getChatId(msg: TelegramBot.Message) {

  return await Bot.sendMessage(msg.chat.id, String(msg.chat.id));

}

export async function awaitTimeout(ms: number) {
  return new Promise((res, rej) => {
    setTimeout(res, ms);
  });
}