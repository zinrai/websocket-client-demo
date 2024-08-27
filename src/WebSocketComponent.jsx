import React, { useState, useRef } from 'react';

function WebSocketComponent() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const startTimeRef = useRef(null);

  const connectWebSocket = () => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      setConnected(true);
      console.log(JSON.stringify({
        event: 'connected',
        timestamp: new Date().toISOString()
      }));
      startTimeRef.current = new Date();
    };

    ws.onmessage = (event) => {
      const endTime = new Date();
      const messageLength = event.data.length;
      const timeTaken = endTime - startTimeRef.current;

      console.log(JSON.stringify({
        event: 'message_received',
        timestamp: endTime.toISOString(),
        messageLength: messageLength,
        timeTakenMs: timeTaken
      }));

      setMessages(prevMessages => [...prevMessages, event.data]);
    };

    ws.onclose = () => {
      setConnected(false);
      console.log(JSON.stringify({
        event: 'disconnected',
        timestamp: new Date().toISOString()
      }));
    };

    ws.onerror = (error) => {
      console.error(JSON.stringify({
        event: 'error',
        timestamp: new Date().toISOString(),
        message: error.message
      }));
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
