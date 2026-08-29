const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Whaddup WhatsApp API',
            version: '1.0.0',
            description: `
A powerful WhatsApp API backend built with Express.js and Baileys library. Multi-session, real-time events, and full messaging capabilities.

## 🔗 Quick Links
| Link | Description |
|------|-------------|
| [🎛️ Dashboard](/dashboard) | Admin Dashboard with API Tester, session management & live events |
| [🔌 WebSocket Test](/ws-test) | Interactive real-time WebSocket event monitor |
| [📄 OpenAPI JSON](/api-docs.json) | Download API specification |
| [🔗 n8n Community Node](https://github.com/ZaimMarzuki/n8n-nodes-whaddup) | Automate WhatsApp with n8n workflows |

## ✨ Features
| Category | Capabilities |
|----------|-------------|
| **Messaging** | Text, Image, Document, Audio, Location, Contact, Poll, Buttons |
| **Bulk Messaging** | Send to 100+ recipients with background job tracking |
| **Reply/Quote** | Reply to specific messages with \`replyTo\` parameter |
| **Sessions** | Multi-session support with persistent auth & configurable webhooks |
| **Groups** | Create, manage participants, settings, invites |
| **Labels** | WhatsApp Business label management |
| **Real-time** | WebSocket events + configurable webhook delivery |
| **Media** | Auto-save incoming media files to server |
| **Dashboard** | Web UI with session management, QR scanner, API tester |
| **Security** | API Key authentication via \`X-Api-Key\` header |

## 🔐 Authentication
All API endpoints require \`X-Api-Key\` header when API_KEY is configured in \`.env\`. Leave API_KEY empty to disable authentication.

## 📚 Documentation & Source
- [GitHub Repository](https://github.com/ZaimMarzuki/whaddup)
- [n8n Integration](https://github.com/ZaimMarzuki/n8n-nodes-whaddup) — install via n8n Community Nodes: \`n8n-nodes-whaddup\`
            `,
            contact: {
                name: 'Whaddup',
                url: 'https://github.com/ZaimMarzuki/whaddup'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: '/',
                description: 'Current Server'
            },
            {
                url: 'http://localhost:3000',
                description: 'Local Development'
            }
        ],
        tags: [
            { name: 'Health', description: 'Health check endpoints' },
            { name: 'Sessions', description: 'WhatsApp session management' },
            { name: 'Messaging', description: 'Send messages (text, image, document, etc.)' },
            { name: 'Bulk Messaging', description: 'Send bulk messages to multiple recipients (max 100 per request)' },
            { name: 'Chat History', description: 'Get chats, messages, contacts' },
            { name: 'Groups', description: 'Group management operations' },
            { name: 'Labels', description: 'WhatsApp Business label management' },
            { name: 'WebSocket', description: 'WebSocket connection info' }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-Api-Key',
                    description: 'API Key for authentication (configured in .env)'
                }
            },
            schemas: {
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Operation successful' },
                        data: { type: 'object' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Error message' }
                    }
                },
                Session: {
                    type: 'object',
                    properties: {
                        sessionId: { type: 'string', example: 'mysession' },
                        status: { type: 'string', enum: ['connecting', 'connected', 'disconnected'], example: 'connected' },
                        isConnected: { type: 'boolean', example: true },
                        phoneNumber: { type: 'string', example: '628123456789' },
                        name: { type: 'string', example: 'John Doe' }
                    }
                },
                Message: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        chatId: { type: 'string' },
                        fromMe: { type: 'boolean' },
                        timestamp: { type: 'integer' },
                        type: { type: 'string' },
                        content: { type: 'object' }
                    }
                },
                Chat: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        isGroup: { type: 'boolean' },
                        unreadCount: { type: 'integer' },
                        lastMessage: { type: 'object' }
                    }
                },
                Group: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        subject: { type: 'string' },
                        owner: { type: 'string' },
                        creation: { type: 'integer' },
                        participants: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    admin: { type: 'string', nullable: true }
                                }
                            }
                        }
                    }
                },
                Webhook: {
                    type: 'object',
                    properties: {
                        url: { type: 'string', format: 'uri', example: 'https://your-server.com/webhook' },
                        events: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['message', 'connection.update']
                        }
                    }
                }
            }
        },
        security: [{ ApiKeyAuth: [] }]
    },
    apis: ['./src/config/swagger-paths.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
