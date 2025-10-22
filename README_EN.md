# SDKWork AIoT SDK

[![npm version](https://img.shields.io/npm/v/sdkwork-ai-iot-sdk.svg)](https://www.npmjs.com/package/sdkwork-ai-iot-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)

A TypeScript-based AIoT (Artificial Intelligence of Things) SDK that supports WebSocket, MQTT, Wukong IM, and other transport protocols, providing core functionalities such as device connection, voice interaction, and data transmission.

## ✨ Features

- 🚀 **Multi-protocol Support**: Supports WebSocket, MQTT, Wukong IM, and other transport protocols
- 📦 **Multi-platform Compatibility**: Compatible with browsers, Node.js, mini-programs, UniApp, and other environments
- 🛡️ **Type Safety**: Complete TypeScript type definitions
- 🎯 **Device Management**: Device connection, status monitoring, and control command sending
- 🔊 **Voice Interaction**: Supports speech recognition, speech synthesis, and real-time audio transmission
- 🔔 **Event System**: Comprehensive event listening and error handling
- 🎨 **Modular Design**: Highly abstracted Transport interface, easy to extend

## 📦 Installation

### NPM Installation
```bash
npm install sdkwork-ai-iot-sdk
# or
yarn add sdkwork-ai-iot-sdk
```

### CDN Import (Browser Environment)
```html
<!-- Use latest version -->
<script src="https://cdn.jsdelivr.net/npm/sdkwork-ai-iot-sdk@latest/dist/umd/sdkwork-ai-iot-sdk.min.js"></script>

<!-- Or specify version -->
<script src="https://cdn.jsdelivr.net/npm/sdkwork-ai-iot-sdk@1.0.0/dist/umd/sdkwork-ai-iot-sdk.min.js"></script>
```

## 🚀 Quick Start

### Browser Environment Usage

#### Via CDN Import
```html
<!DOCTYPE html>
<html>
<head>
    <title>SDKWork AIoT Demo</title>
</head>
<body>
    <button id="connectBtn">Connect Device</button>
    <button id="listenBtn" disabled>Start Listening</button>
    <div id="status">Status: Disconnected</div>
    <div id="messages"></div>

    <script src="https://cdn.jsdelivr.net/npm/sdkwork-ai-iot-sdk@latest/dist/umd/sdkwork-ai-iot-sdk.min.js"></script>
    <script>
        // Use global variable SDKWorkAIoT
        const { SdkworkAIoTClient } = SDKWorkAIoT;
        
        // Option 1: Use API Key authentication (suitable for frontend applications)
        const client = new SDKWorkAIoT.SdkworkAIoTClient({
            apiKey: 'your-api-key',
            deviceId: 'device-001',
            baseUrl: 'wss://api.sdkwork.com/aiot',
            protocol: 'websocket'
        });

        // Option 2: Use Authorization authentication (suitable for backend applications, more secure)
        // const client = new SDKWorkAIoT.SdkworkAIoTClient({
        //     authorization: 'Bearer your-jwt-token',
        //     deviceId: 'device-001',
        //     baseUrl: 'wss://api.sdkwork.com/aiot',
        //     authType: 'authorization'
        // });

        // Connect device
        document.getElementById('connectBtn').addEventListener('click', async () => {
            try {
                await client.initialize();
                document.getElementById('status').textContent = 'Status: Connected';
                document.getElementById('listenBtn').disabled = false;
            } catch (error) {
                console.error('Connection failed:', error);
            }
        });

        // Start voice listening
        document.getElementById('listenBtn').addEventListener('click', () => {
            client.startListening();
        });

        // Listen to events
        client.onEvent('stt_result', (event) => {
            const messages = document.getElementById('messages');
            messages.innerHTML += `<div>Speech Recognition: ${event.data.text}</div>`;
        });

        client.onEvent('llm_response', (event) => {
            const messages = document.getElementById('messages');
            messages.innerHTML += `<div>AI Response: ${event.data.text}</div>`;
        });
    </script>
</body>
</html>
```

#### Via ES Module Import
```html
<!DOCTYPE html>
<html>
<head>
    <title>SDKWork AIoT ES Module Demo</title>
    <script type="module">
        import { SdkworkAIoTClient } from 'https://cdn.jsdelivr.net/npm/sdkwork-ai-iot-sdk@latest/dist/esm/sdkwork-ai-iot-sdk.min.js';
        
        const client = new SdkworkAIoTClient({
            apiKey: 'your-api-key',
            deviceId: 'device-001',
            baseUrl: 'wss://api.sdkwork.com/aiot'
        });

        // Usage same as above
    </script>
</head>
<body>
    <!-- Page content -->
</body>
</html>
```

### Node.js Environment Usage

#### Basic Usage
```typescript
import { SdkworkAIoTClient } from 'sdkwork-ai-iot-sdk';

// Option 1: Use API Key authentication (suitable for frontend applications)
const client = new SdkworkAIoTClient({
    apiKey: 'your-api-key',
    deviceId: 'device-001',
    baseUrl: 'wss://api.sdkwork.com/aiot',
    protocol: 'websocket',
    timeout: 10000
});

// Option 2: Use Authorization authentication (suitable for backend applications, more secure)
// const client = new SdkworkAIoTClient({
//     authorization: 'Bearer your-jwt-token',
//     deviceId: 'device-001',
//     baseUrl: 'wss://api.sdkwork.com/aiot',
//     authType: 'authorization',
//     timeout: 10000
// });

// Initialize connection
await client.initialize();

// Start voice listening
client.startListening();

// Send control command
client.sendControlCommand({
    deviceId: 'device-001',
    command: 'light_on',
    parameters: { brightness: 80 },
    timestamp: new Date()
});

// Listen to speech recognition results
client.onEvent('stt_result', (event) => {
    console.log('Speech recognition result:', event.data.text);
});

// Listen to AI responses
client.onEvent('llm_response', (event) => {
    console.log('AI response:', event.data.text);
});

// Listen to errors
client.onError((error) => {
    console.error('Error occurred:', error);
});
```

### Advanced Usage

#### Using Different Transport Protocols
```typescript
import { SdkworkAIoTClient } from 'sdkwork-ai-iot-sdk';

// Use WebSocket protocol
const wsClient = new SdkworkAIoTClient({
    protocol: 'websocket',
    baseUrl: 'wss://api.sdkwork.com/aiot'
});

// Use MQTT protocol (to be implemented)
const mqttClient = new SdkworkAIoTClient({
    protocol: 'mqtt',
    baseUrl: 'mqtt://api.sdkwork.com:1883'
});
```

#### Custom Transport Implementation
```typescript
import { Transport, TransportEvent } from 'sdkwork-ai-iot-sdk';

class CustomTransport implements Transport {
    async connect(): Promise<void> {
        // Custom connection logic
    }
    
    async disconnect(): Promise<void> {
        // Custom disconnection logic
    }
    
    async send(data: any): Promise<void> {
        // Custom send logic
    }
    
    onEvent(callback: (event: TransportEvent) => void): void {
        // Custom event handling
    }
}

const client = new SdkworkAIoTClient({
    transport: new CustomTransport()
});
```

## 📚 API Reference

### SdkworkAIoTClient

Main client class for AIoT operations.

#### Constructor
```typescript
new SdkworkAIoTClient(options: ClientOptions)
```

**ClientOptions:**
- `apiKey?: string` - API key for authentication
- `authorization?: string` - Authorization token (Bearer token)
- `authType?: 'apiKey' | 'authorization'` - Authentication type (default: 'apiKey')
- `deviceId: string` - Device identifier
- `baseUrl: string` - Base URL for the service
- `protocol?: 'websocket' | 'mqtt' | 'wukong'` - Transport protocol (default: 'websocket')
- `timeout?: number` - Connection timeout in milliseconds (default: 10000)
- `transport?: Transport` - Custom transport implementation

#### Methods

- `initialize(): Promise<void>` - Initialize the connection
- `startListening(): void` - Start voice listening
- `stopListening(): void` - Stop voice listening
- `sendControlCommand(command: ControlCommand): Promise<void>` - Send control command to device
- `onEvent(eventType: string, callback: (event: any) => void): void` - Listen to specific events
- `onError(callback: (error: Error) => void): void` - Listen to errors
- `disconnect(): Promise<void>` - Disconnect from the service

### Events

- `stt_result` - Speech recognition result
- `llm_response` - AI response
- `device_status` - Device status update
- `connection_status` - Connection status change
- `error` - Error occurred

## 🔧 Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/sdkwork/sdkwork-ai-iot-sdk-nodejs.git
cd sdkwork-ai-iot-sdk-nodejs

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Project Structure

```
src/
├── core/           # Core functionality
├── services/       # Service implementations
├── transports/     # Transport protocol implementations
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- 📧 Email: support@sdkwork.com
- 💬 Issues: [GitHub Issues](https://github.com/sdkwork/sdkwork-ai-iot-sdk-nodejs/issues)
- 📖 Documentation: [API Documentation](https://docs.sdkwork.com)

## 🙏 Acknowledgments

Thanks to all contributors and the open-source community for their support.