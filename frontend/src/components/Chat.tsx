import { useState, useContext, KeyboardEvent } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import { AuthContext } from '../context/AuthContext';
import { MessageModel } from "../models/Message";
import { ConversationModel } from "../models/Conversation";
import { Message } from "./Message";
import { ChatLoader } from "./ChatLoader";

export function Chat() {
  const { user } = useContext(AuthContext);
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [conversation, setConversation] = useState<ConversationModel | null>(null);
  const [message, setMessage] = useState("");
  const { conversationName } = useParams();

  console.log(participants);
  
  const { readyState, sendJsonMessage } = useWebSocket(user
    ? `ws://localhost:8000/ws/chat/${conversationName}`
    : null, {
    queryParams: {
      token: user ? user.token : "",
    },

    onOpen: () => {
      console.log("Connected!");
    },

    onClose: (e) => {
      console.log(e);
      console.log("Disconnected!");
    },

    onMessage: (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "chat_message_echo":
          setMessageHistory((prev: any) => prev.concat(data.message));
          break;
        case "last_50_messages":
          setMessageHistory(data.messages);
          break;
        case "user_join":
          setParticipants((pcpts: string[]) => {
            if (!pcpts.includes(data.user)) {
              return [...pcpts, data.user];
            }
            return pcpts;
          });
          break;
        case "user_leave":
          setParticipants((pcpts: string[]) => {
            const newPcpts = pcpts.filter((x) => x !== data.user);
            return newPcpts;
          });
          break;
        case "online_user_list":
          setParticipants(data.users);
          break;
        default:
          console.error("Unknown message type!");
          break;
      }
    }
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState];

  function handleChangeMessage(e: any) {
    setMessage(e.target.value);
  }

  const handleSubmit = () => {
    sendJsonMessage({
      type: "chat_message",
      message,
    });
    setMessage("");
  };

  const handleKeypress = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div>
      <span>The WebSocket is currently {connectionStatus}</span>
      <textarea
        name="message"
        placeholder="Message"
        onChange={handleChangeMessage}
        value={message}
        onKeyPress={handleKeypress}
        className="ml-2 border-gray-300 bg-gray-100"
        rows={5}
        cols={100}
      />
      <button className="ml-3 bg-gray-300 px-3 py-1" onClick={handleSubmit}>
        Submit
      </button>
      <hr />
      <ul>
        {messageHistory.map((message: MessageModel) => (
          <Message key={message.id} message={message} />
        ))}
      </ul>
    </div>
  )
};