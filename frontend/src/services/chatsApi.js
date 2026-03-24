// Api Endpoints Releted to Chats Services

import { http } from "./shared-api/httpRequest"

// production ws url
const PWS = 'wss://whisper-7bux.onrender.com/ws'

export const getWebSocketUrl = (chatId) => {
  const token = localStorage.getItem('authUser')
  const raw = JSON.parse(token)
    return `${PWS}/chat/${chatId}/?token=${raw.access}`
}

export const getChatHistory = {
  getChats: (user1, user2) => {
    return `/get-chat/?user1=${user1}&user2=${user2}`
  }
}

export const getLastSeen = {
  friendlastSeen : (f_id) => http.get(`/last-seen/${f_id}/`)
}