import { Response } from "express";

const clients = new Map<string, Response[]>();

export const sseService = {
  addClient(userId: string, res: Response) {
    if (!clients.has(userId)) clients.set(userId, []);
    clients.get(userId)!.push(res);
    res.on("close", () => {
      const arr = clients.get(userId);
      if (arr) {
        const idx = arr.indexOf(res);
        if (idx >= 0) arr.splice(idx, 1);
        if (arr.length === 0) clients.delete(userId);
      }
    });
  },

  sendEvent(userId: string, event: string, data: any) {
    const arr = clients.get(userId);
    if (!arr) return;
    const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of arr) {
      res.write(msg);
    }
  },

  broadcastOrderUpdate(userId: string, order: { id: string; orderNumber: string; status: string }) {
    this.sendEvent(userId, "order-status", order);
  },
};
