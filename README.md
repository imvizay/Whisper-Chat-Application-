# Whisper-Chat-Application-
Whisperis a real-time, one-to-one messaging application built using Django Channels and React.
It enables two users to communicate instantly with live message delivery, typing indicators, online presence tracking, and read receipts.
The project focuses on implementing WebSockets, Redis-based channel layers, and scalable backend architecture.

# Core Features 
1. User authentication (Email-based)
2.Unique username system
3.1-to-1 private conversations
4.Real-time messaging using WebSockets
5.Online presence indicator
6.Typing indicator
7.Read receipts
8.Redis-backed channel layer
9.Modern responsive UI

# Tech Stacks 
1.Backend
   Django
   Django REST Framework
   Django Channels
   Redis
   Daphne (ASGI server)
2.Frontend
   React (Vite)
   WebSocket API
   Css

# Artitecture Overview
  Whisper follows a hybrid communication architecture:
  REST APIs handle authentication, user search, and data retrieval.
  WebSockets handle real-time messaging, typing events, and presence updates.
  Redis acts as the channel layer for asynchronous message broadcasting.
  Conversations are strictly limited to 1-to-1 communication for simplicity and focus.


# Installation & Setup
note: "setup will be provided once the project is finished."


