const queue: {
  [key: string]: {
    userId: number,
    timestamp: number,
    resolve: (inp: boolean) => void,
  }
} = {};

export function addUser(userId: number) {
  return new Promise<boolean>(resolve => {
    queue[userId] = {
      userId,
      timestamp: Date.now(),
      resolve
    };
  });
}

export function cancelUser(userId: number) {
  try {
    queue[userId].resolve(false);
    delete queue[userId];
  } catch {};
}

export function checkUsers(sheet: string[][]) {
  for(const row of sheet) {
    const [datePart, timePart] = row[0].split(" ");
    const [day, month, year] = datePart.split(".").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    const timestamp = date.getTime();
    for(const id in queue) {
      if(timestamp >= queue[id]?.timestamp && row[3] === id) {
        queue[id].resolve(true);
        delete queue[id];
      }
    }
  }
}