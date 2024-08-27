import React, { useState, useRef } from 'react';

function WebSocketComponent() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  const connectWebSocket = () => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      setMessages(prevMessages => [...prevMessages, event.data]);
    };

    ws.onclose = () => {
      setConnected(false);
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current = ws;
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  return (
    <div>
      <h1>WebSocket Client</h1>
      <button onClick={connectWebSocket} disabled={connected}>
        接続
      </button>
      <button onClick={disconnectWebSocket} disabled={!connected}>
        停止
      </button>
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WebSocketComponent;
