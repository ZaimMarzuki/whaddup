# 🚀 Whaddup WhatsApp API

A powerful WhatsApp API backend built with Express.js and Baileys library. Supports multi-session management, real-time WebSocket events, group management, and media handling.

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express.js](https://img.shields.io/badge/Express.js-5.x-blue.svg)
![Baileys](https://img.shields.io/badge/Baileys-7.x-orange.svg)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-purple.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

> Originally forked from [chatery_whatsapp](https://github.com/farinchan/chatery_whatsapp) by Farin Chan.

---

## ✨ Features

- 📱 **Multi-Session Support** - Manage multiple WhatsApp accounts simultaneously
- 🔌 **Real-time WebSocket** - Get instant notifications for messages, status updates, and more
- 👥 **Group Management** - Create, manage, and control WhatsApp groups
- 🏷️ **Chat Labels** - Label chats and messages for organization (WhatsApp Business)
- 📨 **Send Messages** - Text, images, documents, locations, contacts, and more
- ↩️ **Reply to Messages** - Reply/quote specific messages with replyTo parameter
- 📊 **Poll Messages** - Send interactive polls with single or multiple choice
- 📤 **Bulk Messaging** - Send messages to multiple recipients with background processing
- 📥 **Auto-Save Media** - Automatically save incoming media to server
- 💾 **Persistent Store** - Message history with optimized caching
- 🔐 **Session Persistence** - Sessions survive server restarts
- 🎛️ **Admin Dashboard** - Web-based dashboard with real-time monitoring and API tester
- 📄 **Swagger UI** - Interactive API documentation at root URL
- 🔗 **n8n Integration** - Community node available at [n8n-nodes-whaddup](https://github.com/ZaimMarzuki/n8n-nodes-whaddup)

## 📋 Table of Contents

- [Installation](#-installation)
  - [Standard Installation](#option-1-standard-installation)
  - [Docker Installation](#option-2-docker-installation)
- [Configuration](#-configuration)
- [API Key Authentication](#-api-key-authentication)
- [Quick Start](#-quick-start)
- [Dashboard](#-dashboard)
- [API Documentation](#-api-documentation)
  - [Sessions](#sessions)
  - [Messaging](#messaging)
  - [Bulk Messaging](#bulk-messaging-background-jobs)
  - [Chat History](#chat-history)
  - [Group Management](#group-management)
  - [Labels](#labels-whatsapp-business)
- [WebSocket Events](#-websocket-events)
- [Webhooks](#-webhooks)
- [Examples](#-examples)

## 🛠 Installation

### Option 1: Standard Installation

```bash
# Clone the repository
git clone https://github.com/ZaimMarzuki/whaddup.git
cd whaddup

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the server
npm start

# Or development mode with auto-reload
npm run dev
```

### Option 2: Docker Installation

```bash
# Clone the repository
git clone https://github.com/ZaimMarzuki/whaddup.git
cd whaddup

# Create environment file
cp .env.example .env

# Build and run with Docker Compose
docker compose up -d --build

# View logs
docker compose logs -f

# Stop the container
docker compose down
```

#### Docker Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d --build` | Build and start container in background |
| `docker compose down` | Stop and remove container |
| `docker compose logs -f` | View live logs |
| `docker compose restart` | Restart container |
| `docker compose build --no-cache` | Rebuild image |

#### Docker Volumes

The following data is persisted across container restarts:

| Volume | Path | Description |
|--------|------|-------------|
| `whaddup_sessions` | `/app/sessions` | WhatsApp session data |
| `whaddup_media` | `/app/public/media` | Received media files |
| `whaddup_store` | `/app/store` | Message history store |

## ⚙ Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
CORS_ORIGIN=*

# Dashboard Authentication
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=securepassword123

# API Key Authentication (optional - leave empty or 'your_api_key_here' to disable)
API_KEY=your_secret_api_key_here
```

> **Note:** Personal chat IDs use `@c.us` format (e.g., `628123456789@c.us`). Group IDs use `@g.us` format. Phone numbers are automatically normalized (0 → 62).

## 🔐 API Key Authentication

All WhatsApp API endpoints are protected with API key authentication. Include the `X-Api-Key` header in your requests.

### How to Enable

1. Set a strong API key in your `.env` file:
   ```env
   API_KEY=your_super_secret_key_12345
   ```

2. Include the header in all API requests:
   ```bash
   curl -X GET http://localhost:3000/api/whatsapp/sessions \
     -H "X-Api-Key: your_super_secret_key_12345"
   ```

### Disable Authentication

To disable API key authentication, leave `API_KEY` empty or set it to `your_api_key_here` in `.env`:
```env
API_KEY=
# or
API_KEY=your_api_key_here
```

### Error Responses

| Status | Message | Description |
|--------|---------|-------------|
| 401 | Missing X-Api-Key header | API key not provided in request |
| 403 | Invalid API key | API key doesn't match |

### Dashboard Integration

When logging into the dashboard, you'll be prompted to enter your API key (optional). This allows the dashboard to make authenticated API calls.

## 🚀 Quick Start

1. **Start the server**
   ```bash
   npm start
   ```

2. **Create a session**
   ```bash
   curl -X POST http://localhost:3000/api/whatsapp/sessions/mysession/connect \
     -H "X-Api-Key: your_api_key" \
     -H "Content-Type: application/json"
   ```

3. **Get QR Code** - Open in browser or scan
   ```
   http://localhost:3000/api/whatsapp/sessions/mysession/qr/image
   ```
   Note: QR image endpoint also requires API key. Use curl or include header.

4. **Send a message**
   ```bash
   curl -X POST http://localhost:3000/api/whatsapp/chats/send-text \
     -H "X-Api-Key: your_api_key" \
     -H "Content-Type: application/json" \
     -d '{"sessionId": "mysession", "chatId": "628123456789", "message": "Hello!"}'
   ```

---

## 🎛️ Dashboard

Access the admin dashboard at `http://localhost:3000/dashboard`

### 🔐 Authentication

Dashboard requires login with username and password configured in `.env` file.

| Field | Default Value |
|-------|---------------|
| Username | `admin` |
| Password | `admin123` |

### ✨ Dashboard Features

| Feature | Description |
|---------|-------------|
| 📊 **Real-time Stats** | Monitor total sessions, connected/disconnected status, and WebSocket clients |
| 📱 **Session Management** | Create, connect, reconnect, and delete WhatsApp sessions |
| 📷 **QR Code Scanner** | Scan QR codes directly from the dashboard |
| 📡 **Live Events** | Real-time WebSocket event viewer with filtering |
| 💬 **Quick Send** | Send messages quickly to any number |
| 🧪 **API Tester** | Test all 40+ API endpoints with pre-filled templates |
| 📤 **Bulk Messaging** | Send messages to multiple recipients with job tracking |
| 🔗 **Webhook Manager** | Add, remove, and configure webhooks per session |
| 🚪 **Logout** | Secure logout button in header |

### 📸 Screenshots

![Dashboard Screenshot](./screenshot/image.png)

The dashboard provides a modern dark-themed interface:
- **Session Cards** - View all sessions with status indicators
- **QR Modal** - Full-screen QR code for easy scanning
- **Event Log** - Live scrolling event feed with timestamps
- **API Tester** - Dropdown with all endpoints and auto-generated request bodies

---

## 📚 API Documentation

Base URL: `http://localhost:3000/api/whatsapp`

### Sessions

#### List All Sessions
```http
GET /sessions
```

**Response:**
```json
{
  "success": true,
  "message": "Sessions retrieved",
  "data": [
    {
      "sessionId": "mysession",
      "status": "connected",
      "isConnected": true,
      "phoneNumber": "628123456789",
      "name": "John Doe",
      "webhooks": [
        {
          "url": "https://your-server.com/webhook",
          "events": ["message", "message_ack"]
        }
      ],
      "metadata": {
        "userId": "user123",
        "plan": "premium"
      }
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `sessionId` | string | Unique session identifier |
| `status` | string | Current status: `disconnected`, `connecting`, `qr_ready`, `connected` |
| `isConnected` | boolean | Whether session is currently connected |
| `phoneNumber` | string | Connected WhatsApp phone number |
| `name` | string | WhatsApp profile name |
| `webhooks` | array | Configured webhooks for this session |
| `metadata` | object | Custom metadata associated with this session |

#### Create/Connect Session
```http
POST /sessions/:sessionId/connect
```

**Body (Optional):**
```json
{
  "metadata": {
    "userId": "user123",
    "plan": "premium",
    "customField": "any value"
  },
  "webhooks": [
    { "url": "https://your-server.com/webhook", "events": ["all"] },
    { "url": "https://backup-server.com/webhook", "events": ["message"] }
  ]
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `metadata` | object | Optional. Custom metadata to store with session |
| `webhooks` | array | Optional. Array of webhook configs `[{ url, events }]` |

**Response:**
```json
{
  "success": true,
  "message": "Session created",
  "data": {
    "sessionId": "mysession",
    "status": "qr_ready",
    "qrCode": "data:image/png;base64,...",
    "metadata": { "userId": "user123" },
    "webhooks": [
      { "url": "https://your-server.com/webhook", "events": ["all"] }
    ]
  }
}
```

#### Update Session Config
```http
PATCH /sessions/:sessionId/config
```

**Body:**
```json
{
  "metadata": { "newField": "value" },
  "webhooks": [
    { "url": "https://new-webhook.com/endpoint", "events": ["message", "connection.update"] }
  ]
}
```

#### Add Webhook
```http
POST /sessions/:sessionId/webhooks
```

**Body:**
```json
{
  "url": "https://another-server.com/webhook",
  "events": ["message", "connection.update"]
}
```

#### Remove Webhook
```http
DELETE /sessions/:sessionId/webhooks
```

**Body:**
```json
{
  "url": "https://another-server.com/webhook"
}
```

#### Get Session Status
```http
GET /sessions/:sessionId/status
```

#### Get QR Code (JSON)
```http
GET /sessions/:sessionId/qr
```

#### Get QR Code (Image)
```http
GET /sessions/:sessionId/qr/image
```
Returns a PNG image that can be displayed directly in browser or scanned.

#### Delete Session
```http
DELETE /sessions/:sessionId
```

---

### Messaging

> **💡 Typing Indicator**: All messaging endpoints support `typingTime` parameter (in milliseconds) to simulate typing before sending the message. This makes the bot appear more human-like.
>
> **↩️ Reply to Message**: All messaging endpoints support `replyTo` parameter to reply to a specific message. Pass the message ID to quote/reply to that message.

#### Send Text Message
```http
POST /chats/send-text
```

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "message": "Hello, World!",
  "typingTime": 2000,
  "replyTo": "3EB0B430A2B52B67D0"
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `chatId` | string | Required. Phone number (628xxx) or group ID (xxx@g.us) |
| `message` | string | Required. Text message to send |
| `typingTime` | number | Optional. Typing duration in ms before sending (default: 0) |
| `replyTo` | string | Optional. Message ID to reply to |

#### Send Image
```http
POST /chats/send-image
```

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "imageUrl": "https://example.com/image.jpg",
  "caption": "Check this out!",
  "typingTime": 1500,
  "replyTo": null
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `chatId` | string | Required. Phone number or group ID |
| `imageUrl` | string | Required. Direct URL to image file |
| `caption` | string | Optional. Image caption |
| `typingTime` | number | Optional. Typing duration in ms (default: 0) |
| `replyTo` | string | Optional. Message ID to reply to |

#### Send Document
```http
POST /chats/send-document
```

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "documentUrl": "https://example.com/document.pdf",
  "filename": "document.pdf",
  "mimetype": "application/pdf",
  "caption": "Here is the document you requested",
  "typingTime": 1000,
  "replyTo": null
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `chatId` | string | Required. Phone number or group ID |
| `documentUrl` | string | Required. Direct URL to document |
| `filename` | string | Required. Filename to display |
| `mimetype` | string | Optional. MIME type (default: application/pdf) |
| `caption` | string | Optional. Caption text for the document |
| `typingTime` | number | Optional. Typing duration in ms (default: 0) |
| `replyTo` | string | Optional. Message ID to reply to |

#### Send Audio
```http
POST /chats/send-audio
```

> ⚠️ **Important:** Audio must be in **OGG format** (.ogg). WhatsApp only supports OGG audio files with Opus codec.
> 
> Convert audio using FFmpeg: `ffmpeg -i input.mp3 -c:a libopus output.ogg`

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "audioUrl": "https://example.com/audio.ogg",
  "ptt": true,
  "typingTime": 1000,
  "replyTo": null
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `chatId` | string | Required. Phone number or group ID |
| `audioUrl` | string | Required. Direct URL to OGG audio file (.ogg format only) |
| `ptt` | boolean | Optional. Push to talk mode - true = voice note, false = audio file (default: false) |
| `typingTime` | number | Optional. Recording simulation in ms (default: 0) |
| `replyTo` | string | Optional. Message ID to reply to |

#### Send Location
```http
POST /chats/send-location
```

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "name": "Jakarta, Indonesia",
  "typingTime": 1000,
  "replyTo": null
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `chatId` | string | Required. Phone number or group ID |
| `latitude` | number | Required. GPS latitude |
| `longitude` | number | Required. GPS longitude |
| `name` | string | Optional. Location name |
| `typingTime` | number | Optional. Typing duration in ms (default: 0) |
| `replyTo` | string | Optional. Message ID to reply to |

#### Send Contact
```http
POST /chats/send-contact
```

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "contactName": "John Doe",
  "contactPhone": "628987654321",
  "typingTime": 500,
  "replyTo": null
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `chatId` | string | Required. Phone number or group ID |
| `contactName` | string | Required. Contact display name |
| `contactPhone` | string | Required. Contact phone number |
| `typingTime` | number | Optional. Typing duration in ms (default: 0) |
| `replyTo` | string | Optional. Message ID to reply to |

#### Send Poll Message
```http
POST /chats/send-poll
```

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "question": "What is your favorite color?",
  "options": ["Red", "Blue", "Green", "Yellow"],
  "selectableCount": 1,
  "typingTime": 2000,
  "replyTo": null
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `chatId` | string | Required. Phone number or group ID |
| `question` | string | Required. Poll question |
| `options` | array | Required. Array of options (2-12 items) |
| `selectableCount` | number | Optional. Number of selectable options (default: 1) |
| `typingTime` | number | Optional. Typing duration in ms (default: 0) |
| `replyTo` | string | Optional. Message ID to reply to |

#### Send Button Message (DEPRECATED)
```http
POST /chats/send-button
```

> ⚠️ **Note:** WhatsApp deprecated button messages in 2022. This endpoint now uses **Poll** as an alternative.

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "text": "Please choose an option:",
  "footer": "Powered by Whaddup",
  "buttons": ["Option 1", "Option 2", "Option 3"],
  "typingTime": 2000,
  "replyTo": null
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `chatId` | string | Required. Phone number or group ID |
| `text` | string | Required. Poll question (combined with footer) |
| `footer` | string | Optional. Additional text |
| `buttons` | array | Required. Array of options (poll choices) |
| `typingTime` | number | Optional. Typing duration in ms (default: 0) |
| `replyTo` | string | Optional. Message ID to reply to |

#### Send Presence Update
```http
POST /chats/presence
```

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "presence": "composing"
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `chatId` | string | Required. Phone number or group ID |
| `presence` | string | Required. `composing`, `recording`, `paused`, `available`, `unavailable` |

#### Check Phone Number
```http
POST /chats/check-number
```

**Body:**
```json
{
  "sessionId": "mysession",
  "phone": "628123456789"
}
```

#### Get Profile Picture
```http
POST /chats/profile-picture
```

**Body:**
```json
{
  "sessionId": "mysession",
  "phone": "628123456789"
}
```

---

### Bulk Messaging (Background Jobs)

Bulk messaging runs in the background and returns immediately with a job ID. You can track progress using the status endpoint.

> **⚡ Background Processing**: All bulk endpoints return immediately with a `jobId`. Messages are sent in background to avoid request timeouts. Track progress with the status endpoint.

#### Send Bulk Text Message
```http
POST /chats/send-bulk
```

**Body:**
```json
{
  "sessionId": "mysession",
  "recipients": ["628123456789", "628987654321", "628111222333"],
  "message": "Hello! This is a bulk message.",
  "delayBetweenMessages": 1000,
  "typingTime": 0
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `recipients` | array | Required. Array of phone numbers (max 100) |
| `message` | string | Required. Text message to send |
| `delayBetweenMessages` | number | Optional. Delay between messages in ms (default: 1000) |
| `typingTime` | number | Optional. Typing indicator duration in ms (default: 0) |

**Response:**
```json
{
  "success": true,
  "message": "Bulk message job started. Check status with jobId.",
  "data": {
    "jobId": "bulk_1704326400000_abc123def",
    "total": 3,
    "statusUrl": "/api/whatsapp/chats/bulk-status/bulk_1704326400000_abc123def"
  }
}
```

#### Send Bulk Image
```http
POST /chats/send-bulk-image
```

**Body:**
```json
{
  "sessionId": "mysession",
  "recipients": ["628123456789", "628987654321"],
  "imageUrl": "https://example.com/image.jpg",
  "caption": "Check out this image!",
  "delayBetweenMessages": 1000,
  "typingTime": 0
}
```

#### Send Bulk Document
```http
POST /chats/send-bulk-document
```

**Body:**
```json
{
  "sessionId": "mysession",
  "recipients": ["628123456789", "628987654321"],
  "documentUrl": "https://example.com/document.pdf",
  "filename": "document.pdf",
  "mimetype": "application/pdf",
  "delayBetweenMessages": 1000,
  "typingTime": 0
}
```

#### Get Bulk Job Status
```http
GET /chats/bulk-status/:jobId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "mysession",
    "type": "text",
    "status": "processing",
    "total": 50,
    "sent": 25,
    "failed": 2,
    "progress": 54,
    "details": [
      {
        "recipient": "628123456789",
        "status": "sent",
        "messageId": "ABC123",
        "timestamp": "2026-01-04T10:00:00.000Z"
      },
      {
        "recipient": "628987654321",
        "status": "failed",
        "error": "Number not registered",
        "timestamp": "2026-01-04T10:00:01.000Z"
      }
    ],
    "createdAt": "2026-01-04T10:00:00.000Z",
    "completedAt": null
  }
}
```

#### Get All Bulk Jobs
```http
POST /chats/bulk-jobs
```

**Body:**
```json
{
  "sessionId": "mysession"
}
```

---

### Chat History

#### Get Chats Overview
```http
POST /chats/overview
```

**Body:**
```json
{
  "sessionId": "mysession",
  "limit": 50,
  "offset": 0,
  "type": "all"
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `limit` | number | Optional. Max results (default: 50) |
| `offset` | number | Optional. Pagination offset (default: 0) |
| `type` | string | Optional. Filter: `all`, `personal`, `group` |

#### Get Contacts
```http
POST /contacts
```

**Body:**
```json
{
  "sessionId": "mysession",
  "limit": 100,
  "offset": 0,
  "search": "john"
}
```

#### Get Chat Messages
```http
POST /chats/messages
```

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789@c.us",
  "limit": 50,
  "cursor": null
}
```

#### Get Chat Info
```http
POST /chats/info
```

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789@c.us"
}
```

#### Mark Chat as Read
```http
POST /chats/mark-read
```

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789"
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `chatId` | string | Required. Phone number or group ID (`@c.us` or `@g.us`) |

---

### Group Management

#### Get All Groups
```http
POST /groups
```

**Body:**
```json
{
  "sessionId": "mysession"
}
```

#### Create Group
```http
POST /groups/create
```

**Body:**
```json
{
  "sessionId": "mysession",
  "name": "My New Group",
  "participants": ["628123456789", "628987654321"]
}
```

#### Get Group Metadata
```http
POST /groups/metadata
```

**Body:**
```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us"
}
```

#### Add Participants
```http
POST /groups/participants/add
```

**Body:**
```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us",
  "participants": ["628111222333", "628444555666"]
}
```

#### Remove Participants
```http
POST /groups/participants/remove
```

#### Promote to Admin
```http
POST /groups/participants/promote
```

#### Demote from Admin
```http
POST /groups/participants/demote
```

#### Update Group Subject (Name)
```http
POST /groups/subject
```

#### Update Group Description
```http
POST /groups/description
```

#### Update Group Settings
```http
POST /groups/settings
```

**Body:**
```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us",
  "setting": "announcement"
}
```

| Setting | Description |
|---------|-------------|
| `announcement` | Only admins can send messages |
| `not_announcement` | All participants can send messages |
| `locked` | Only admins can edit group info |
| `unlocked` | All participants can edit group info |

#### Update Group Picture
```http
POST /groups/picture
```

#### Leave Group
```http
POST /groups/leave
```

#### Join Group via Invite
```http
POST /groups/join
```

#### Get Invite Code
```http
POST /groups/invite-code
```

#### Revoke Invite Code
```http
POST /groups/revoke-invite
```

---

## 🏷️ Labels (WhatsApp Business)

WhatsApp Business labels help you organize and categorize chats. Available only for WhatsApp Business accounts.

### Get All Labels
```http
POST /labels
```

### Create/Update Label
```http
POST /labels/create
```

**Body:**
```json
{
  "sessionId": "mysession",
  "name": "My Label",
  "colorId": 3,
  "labelId": null
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `name` | string | Required. Label name |
| `colorId` | number | Optional. Color ID (0-19), default: 0 |
| `labelId` | string | Optional. Existing label ID to update |

### Delete Label
```http
POST /labels/delete
```

### Add Label to Chat
```http
POST /labels/chat/add
```

### Remove Label from Chat
```http
POST /labels/chat/remove
```

### Get Labels for Chat
```http
POST /labels/chat
```

> **Note:** Labels are only available for WhatsApp Business accounts. Personal accounts cannot use labels.

---

## 🔌 WebSocket Events

Connect to WebSocket server at `ws://localhost:3000`

### Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Subscribe to a session
socket.emit('subscribe', 'mysession');

// Unsubscribe from a session
socket.emit('unsubscribe', 'mysession');
```

### Events

| Event | Description | Payload |
|-------|-------------|---------|
| `qr` | QR code generated | `{ sessionId, qrCode, timestamp }` |
| `connection.update` | Connection status changed | `{ sessionId, status, phoneNumber?, name?, timestamp }` |
| `message` | New message received | `{ sessionId, message, timestamp }` |
| `message.sent` | Message sent confirmation | `{ sessionId, message, timestamp }` |
| `message.update` | Message status update | `{ sessionId, update, timestamp }` |
| `message.reaction` | Message reaction added | `{ sessionId, reactions, timestamp }` |
| `message.revoke` | Message deleted/revoked | `{ sessionId, key, participant, timestamp }` |
| `chat.update` | Chat updated | `{ sessionId, chats, timestamp }` |
| `chat.upsert` | New chat created | `{ sessionId, chats, timestamp }` |
| `chat.delete` | Chat deleted | `{ sessionId, chatIds, timestamp }` |
| `contact.update` | Contact updated | `{ sessionId, contacts, timestamp }` |
| `presence.update` | Typing, online status | `{ sessionId, presence, timestamp }` |
| `group.participants` | Group members changed | `{ sessionId, update, timestamp }` |
| `group.update` | Group info changed | `{ sessionId, update, timestamp }` |
| `call` | Incoming call | `{ sessionId, call, timestamp }` |
| `labels` | Labels updated (business) | `{ sessionId, labels, timestamp }` |
| `logged.out` | Session logged out | `{ sessionId, message, timestamp }` |

### Example: Listen for Messages

```javascript
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to WebSocket');
  socket.emit('subscribe', 'mysession');
});

socket.on('message', (data) => {
  console.log('New message:', data.message);
});

socket.on('qr', (data) => {
  console.log('Scan QR Code:', data.qrCode);
});

socket.on('connection.update', (data) => {
  console.log('Connection status:', data.status);
  if (data.status === 'connected') {
    console.log(`Connected as ${data.name} (${data.phoneNumber})`);
  }
});
```

### WebSocket Test Page

Open `http://localhost:3000/ws-test` in your browser for an interactive WebSocket testing interface.

---

## 🪝 Webhooks

You can configure multiple webhook URLs to receive events from your WhatsApp session. Each webhook can subscribe to specific events.

### Setup Multiple Webhooks

```bash
# When creating session with multiple webhooks
curl -X POST http://localhost:3000/api/whatsapp/sessions/mysession/connect \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": { "userId": "123" },
    "webhooks": [
      { "url": "https://primary-server.com/webhook", "events": ["all"] },
      { "url": "https://analytics.example.com/webhook", "events": ["message"] },
      { "url": "https://backup.example.com/webhook", "events": ["connection.update"] }
    ]
  }'

# Add a webhook to existing session
curl -X POST http://localhost:3000/api/whatsapp/sessions/mysession/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://new-webhook.com/endpoint",
    "events": ["message", "connection.update"]
  }'

# Remove a webhook
curl -X DELETE http://localhost:3000/api/whatsapp/sessions/mysession/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://new-webhook.com/endpoint"
  }'
```

### Webhook Payload

```json
{
  "event": "message",
  "sessionId": "mysession",
  "metadata": {
    "userId": "123",
    "customField": "value"
  },
  "data": {
    "id": "ABC123",
    "from": "628123456789@c.us",
    "text": "Hello!",
    "timestamp": 1234567890
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Webhook Headers

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |
| `X-Webhook-Source` | `whaddup-whatsapp-api` |
| `X-Session-Id` | Session ID |
| `X-Webhook-Event` | Event name |

### Available Webhook Events

| Event | Description |
|-------|-------------|
| `connection.update` | Connection status changed (connected, disconnected) |
| `message` | New message received |
| `message.sent` | Message sent confirmation |

Set `events: ["all"]` to receive all events, or specify individual events per webhook.

### WebSocket Stats

```http
GET /api/websocket/stats
```

---

## 📁 Project Structure

```
whaddup/
├── index.js                 # Application entry point
├── package.json
├── .env                     # Environment variables
├── Dockerfile               # Docker build config
├── docker-compose.yml       # Docker Compose config
├── public/
│   ├── dashboard.html       # Admin dashboard
│   ├── websocket-test.html  # WebSocket test page
│   └── media/               # Auto-saved media files
│       └── {sessionId}/
│           └── {chatId}/
├── sessions/                # Session authentication data
│   └── {sessionId}/
│       ├── creds.json
│       └── store.json
└── src/
    ├── config/
    │   ├── swagger.js
    │   └── swagger-paths.js
    ├── middleware/
    │   └── apiKeyAuth.js
    ├── routes/
    │   └── whatsapp.js      # API routes
    └── services/
        ├── websocket/
        │   └── WebSocketManager.js
        └── whatsapp/
            ├── index.js
            ├── WhatsAppManager.js
            ├── WhatsAppSession.js
            ├── BaileysStore.js
            └── MessageFormatter.js
```

---

## 📝 Examples

### Node.js Client

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3000/api/whatsapp';
const API_KEY = 'your_api_key';
const headers = { 'X-Api-Key': API_KEY };

// Create session
async function createSession(sessionId) {
  const response = await axios.post(`${API_URL}/sessions/${sessionId}/connect`, {}, { headers });
  return response.data;
}

// Send message
async function sendMessage(sessionId, chatId, message) {
  const response = await axios.post(`${API_URL}/chats/send-text`, {
    sessionId,
    chatId,
    message
  }, { headers });
  return response.data;
}

// Get all groups
async function getGroups(sessionId) {
  const response = await axios.post(`${API_URL}/groups`, { sessionId }, { headers });
  return response.data;
}
```

### Python Client

```python
import requests

API_URL = 'http://localhost:3000/api/whatsapp'
API_KEY = 'your_api_key'
HEADERS = {'X-Api-Key': API_KEY}

# Create session
def create_session(session_id):
    response = requests.post(f'{API_URL}/sessions/{session_id}/connect', headers=HEADERS)
    return response.json()

# Send message
def send_message(session_id, chat_id, message):
    response = requests.post(f'{API_URL}/chats/send-text', json={
        'sessionId': session_id,
        'chatId': chat_id,
        'message': message
    }, headers=HEADERS)
    return response.json()

# Get all groups
def get_groups(session_id):
    response = requests.post(f'{API_URL}/groups', json={
        'sessionId': session_id
    }, headers=HEADERS)
    return response.json()
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| 📄 Swagger UI (API Docs) | http://localhost:3000 |
| 🎛️ Dashboard | http://localhost:3000/dashboard |
| 📚 API Base URL | http://localhost:3000/api/whatsapp |
| 🔌 WebSocket Test | http://localhost:3000/ws-test |
| 📊 WebSocket Stats | http://localhost:3000/api/websocket/stats |
| ❤️ Health Check | http://localhost:3000/api/health |
| 📋 OpenAPI JSON | http://localhost:3000/api-docs.json |
| 🔗 n8n Community Node | https://github.com/ZaimMarzuki/n8n-nodes-whaddup |

---

## ⚠️ Disclaimer

This project is not affiliated with WhatsApp or Meta. Use at your own risk. Make sure to comply with WhatsApp's Terms of Service.
