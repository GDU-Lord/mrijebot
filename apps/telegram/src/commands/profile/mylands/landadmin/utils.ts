import path from "path";
import * as fs from "fs";
import axios from "axios";
import "dotenv/config";
import { Bot } from "../../../../core";
import { User } from "../../../../../../core/src/entities/user.entity";
import { queueFunction } from "apps/telegram/src/core/cooldown";

export async function downloadFile(fileId: string, announcementId: number, destFolder: string) {
  const file = await queueFunction(async () => await Bot.getFile(fileId));
  const filePath = file.file_path;
  if(!filePath) return;
  const downloadUrl = `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;

  const fileName = announcementId + "__" + fileId;
  const destPath = path.join(destFolder, fileName);

  const writer = fs.createWriteStream(destPath);
  const response = await axios<any>({
    url: downloadUrl,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return await new Promise<string>((resolve, reject) => {
    writer.on('finish', () => resolve(destPath));
    writer.on('error', reject);
  });
}

export function mentionUser(user: User | null) {
  return `<a href="tg://user?id=${user?.telegramId}">${user?.username}</a>`;
}