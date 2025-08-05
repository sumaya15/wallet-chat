# Wallet-Gated AI Chat

A secure app that enables Ethereum wallet-connected users to chat with an AI via OpenRouter.

## Features

✅ **Wallet Authentication**  
- Connect with MetaMask (Microsoft Edge supported)  
- Displays truncated wallet address  
- Copy address to clipboard  

✅ **AI Chat**  
- GPT-3.5-turbo via OpenRouter API  
- Real-time message bubbles  
- Loading states and error handling  

✅ **Security**  
- Wallet-gated access (chat disabled when disconnected)  
- API keys secured via `.env`  

## Tech Stack

- Frontend: React + Vite  
- Blockchain: Wagmi + Viem  
- AI: OpenRouter API  

## Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/your-repo/wallet-chat.git
   cd wallet-chat

2. **Configure environment**
	Rename .env.example to .env
	Get your API key from OpenRouter

3. **Install & run**
	npm install
	npm run dev

4. **Testing**
	Open in Browser (Microsoft Edge)
	Connect your Ethereum wallet
	Send test messages to verify AI responses

5. **Build**
	npm run build
	
Vercel Link (Live Demo) = https://vercel.com/sumaya-sarker-snigdhas-projects/wallet-chat-app
