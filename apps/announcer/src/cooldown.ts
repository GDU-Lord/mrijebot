export type queueFnc<t extends any> = (...value: any[]) => t | Promise<t>;

export interface queueItem {
    res: Function,
    rej: Function,
    fnc: queueFnc<any>,
}

const queue: queueItem[] = [];

export async function queueFunction<t extends any>(fnc: queueFnc<t>) {
    return await new Promise<t>((res, rej) => queue.push({res, rej, fnc}));
}

export function initQueueLoop() {
    setInterval(queueLoop, 50);
}

async function queueLoop() {
    const r = queue.shift();
    if(!r) return;
    const {res, rej, fnc} = r;
    try {
        const fncr = await fnc();
        res(fncr);
    }
    catch (err) {
        rej(err);
    }
}