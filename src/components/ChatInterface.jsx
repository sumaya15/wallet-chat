import { useState } from 'react';
import axios from 'axios';

export default function ChatInterface({ isConnected }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputMessage.trim() || !isConnected) return;

    setIsLoading(true);
    
    // user message immediately
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      // temporary "AI is typing" message
      setMessages(prev => [...prev, { text: '...', sender: 'ai' }]);

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "gpt-3.5-turbo", // Free tier model
          messages: [{ role: "user", content: inputMessage }]
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Wallet-Chat',
            'Content-Type': 'application/json'
          }
        }
      );

      // Replace "..." with actual AI response
      setMessages(prev => [
        ...prev.filter(msg => msg.text !== '...'),
        { text: response.data.choices[0].message.content, sender: 'ai' }
      ]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [
        ...prev.filter(msg => msg.text !== '...'),
        { text: 'Error: Failed to get response', sender: 'ai' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '20px',
      backgroundColor: 'white'
    }}>
      {/* Message History */}
      <div style={{
        height: '300px',
        overflowY: 'auto',
        marginBottom: '12px',
        padding: '8px',
        backgroundColor: '#f8fafc',
        borderRadius: '4px'
      }}>
        {messages.length === 0 ? (
          <p style={{ 
            color: '#64748b',
            textAlign: 'center',
            marginTop: '120px'
          }}>
            {isConnected ? 'Send your first message!' : 'Connect wallet to chat'}
          </p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              margin: '8px 0'
            }}>
              <div style={{
                display: 'inline-block',
                maxWidth: '80%',
                padding: '8px 12px',
                backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#e2e8f0',
                color: msg.sender === 'user' ? 'white' : '#1e293b',
                borderRadius: msg.sender === 'user' 
                  ? '12px 12px 0 12px' 
                  : '12px 12px 12px 0',
                wordBreak: 'break-word'
              }}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isConnected ? "Type a message..." : "Connect wallet to chat"}
          disabled={!isConnected || isLoading}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={!isConnected || isLoading || !inputMessage.trim()}
          style={{
            padding: '0 16px',
            backgroundColor: isConnected ? '#3b82f6' : '#94a3b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isConnected ? 'pointer' : 'not-allowed',
            opacity: isLoading ? 0.7 : 1,
            transition: 'all 0.2s',
            minWidth: '80px'
          }}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}