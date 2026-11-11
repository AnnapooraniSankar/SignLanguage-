# Sign Language Platform

A local Node.js + Express + Socket.IO platform for signer/non-signer communication, WebRTC video calling, captions, chat, and speech-to-text.

## Requirements

- Windows 10/11
- Node.js 18+ (Node.js 20/22 recommended)
- A modern browser such as Chrome or Edge

## First-time setup on a new laptop

Open PowerShell in this project folder and run:

```powershell
npm install
npm start
```

The server runs at:

- http://localhost:3000/
- http://localhost:3000/signer
- http://localhost:3000/nonsigner
- http://localhost:3000/speech
- http://localhost:3000/api/health

## Important

Do NOT use VS Code Live Server / port 5500 for this project. The Express server must serve the pages because `/signer`, `/nonsigner`, Socket.IO, and the WebRTC application are handled by `server.js`.

Use `http://localhost:3000/`, not `http://127.0.0.1:5500/`.

## Every later run

```powershell
npm start
```

Then open:

http://localhost:3000/

Keep the terminal running while using the application.

## Test the server

```powershell
node --check server.js
```

Then start the server and open:

http://localhost:3000/api/health

Expected response:

```json
{"status":"ok","service":"Sign Language Platform"}
```

## Two-device testing

For two laptops on the same Wi-Fi, find the server laptop IPv4 address with:

```powershell
ipconfig
```

Then on the second laptop open:

```text
http://SERVER_IP:3000/
```

Windows Firewall may need to allow Node.js on private networks. WebRTC camera/microphone permissions must also be granted.

For internet-wide WebRTC calling, a TURN server may be required; the included Google STUN server is not a guaranteed solution for every NAT/firewall.
