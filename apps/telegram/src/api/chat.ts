import { api } from "../../../announcer/src/api";
import { AddChatDto } from "../../../core/src/controllers/chat/dtos/add-chat.dto";
import { Chat } from "../../../core/src/entities/chat.entity";

export async function addChat(chatId: string, title: string, invite: string, landId: number | null) {
  return api.post('/chats', { chatId, title, invite, landId } as AddChatDto, {}, (err) => console.log(err));
}

export async function editChat(id: number, chatId: string, title: string, invite: string, landId: number | null) {
  return api.put('/chats/edit/' + id, { chatId, title, invite, landId } as AddChatDto, {}, (err) => console.log(err));
}

export async function getChatByChatId(chatId: string) {
  return api.get<Chat>('/chats/byChatId/' + chatId, {}, (err) => console.log(err));
}

export async function getAllChats() {
  return api.get<Chat[]>('/chats', {}, (err) => console.log(err));
}

export async function addChatUser(chatId: number, userId: number) {
  return api.put(`/chats/${chatId}/add/${userId}`, {}, {}, (err) => console.log(err));
}

export async function removeChatUser(chatId: number, userId: number) {
  return api.delete(`/chats/${chatId}/remove/${userId}`, {}, (err) => console.log(err));
}