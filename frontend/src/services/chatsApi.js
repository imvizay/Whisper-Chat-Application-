// Api Endpoints Releted to Chats Services

import { http } from "./shared-api/httpRequest"

export const getWebSocketUrl = (chatId) => {
  const token = localStorage.getItem('authUser')
  const raw = JSON.parse(token)
    return `ws://127.0.0.1:8000/ws/chat/${chatId}/?token=${raw.access}`
}

export const getChatHistory = {
  getChats: (user1, user2) => {
    return `/get-chat/?user1=${user1}&user2=${user2}`
  }
}

export const getLastSeen = {
  friendlastSeen : (f_id) => http.get(`/last-seen/${f_id}/`)
}