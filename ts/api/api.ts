console.log("Connecting to the API...");

import { google, sheets_v4 } from "googleapis";
import "dotenv/config.js";
import { checkUsers } from "./queue.js";

let sheet: string[][] = [];
let sheetAccess: sheets_v4.Sheets;

async function getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.SERVICE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient: any = await auth.getClient();
  return google.sheets({
    version: "v4",
    auth: authClient
  });
}

export async function readSheet() {
  sheetAccess = await getGoogleSheetClient();
  const params: sheets_v4.Params$Resource$Spreadsheets$Values$Get = {
    spreadsheetId: process.env.SHEET_ID,
    range: `A:AD`
  };
  sheet = (await sheetAccess.spreadsheets.values.get(params)).data.values as string[][];
}

await readSheet();

export function getUserData(userId: string, username: string): [string[], number] {
  let data: string[] = [];
  let index: number = -1;
  sheet.forEach((row: string[], _index) => {
    if((row[3] !== userId) && (row[3] !== `@${username}`)) return;
    for(const i in row)
      data[i] = (data[i] ?? "") === "" ? row[i] : data[i];
    index = _index;
  });
  return [data, index];
  // must compile instead of taking the first one
}

export async function setUserData(userData: string[], index: number) {
  await sheetAccess.spreadsheets.batchUpdate({
    spreadsheetId: process.env.SHEET_ID,
    requestBody: { 
      requests: [
        {
          updateCells: {
            fields: "*",
            range: {
              sheetId: 1190521735,
              startRowIndex: index,
              endRowIndex: index + 1,
              startColumnIndex: 0,
              endColumnIndex: 30,
            },
            rows: [{
              values: userData.map(val => {
                return {
                  userEnteredValue: {
                    stringValue: val
                  }
                };
              })
            }]
          }
        }
      ]
    }
  });
}

setInterval(async () => {
  console.log("reading...");
  await readSheet();
  console.log("read!");
  checkUsers(sheet);
}, 1000*60*0.5);