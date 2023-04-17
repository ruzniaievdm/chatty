import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocket } from "../../socket";

function Chat() {
  const { roomName } = useParams();
  const [webSocket, setWebSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  console.log(messages);

  useEffect(() => {
    const ws = createSocket(roomName);
    setWebSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setConnected(true);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setConnected(false);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      switch (data.command) {
        case "fetch_messages":
          setMessages(data.messages);
          break;
        case "new_message":
          setMessages((prev) => [...prev, data.message]);
          break;
        default:
          log.error("Unknown message type!");
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (connected && webSocket) {
      webSocket.send(
        JSON.stringify({
          command: "fetch_messages",
        })
      );
    }
  }, [connected, webSocket]);

  const sendMessage = () => {
    webSocket.send(
      JSON.stringify({
        command: "new_message",
        message,
      })
    )
    setMessage('');
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <ul>
        {messages.length && messages.map((msg) => (
          <li key={msg?.id}>
            {msg?.sender}: {msg?.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Chat;
