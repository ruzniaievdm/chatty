// @ts-nocheck
import axios from "../axios";
import { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from "../context/AuthContext";
import { ConversationModel } from "../models/Conversation";
import { createConversationName, formatMessageTimestamp } from "../utils";

const ActiveConversations = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setActiveConversations] = useState<ConversationModel[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await axios.get('api/conversations/', {
        headers: {
          Authorization: `Token ${user?.token}`
        }
      })

      setActiveConversations(data);
    }
    fetchUsers();
  }, [user])

  return (
    <div>
      {conversations.map((c) => (
        <Link
          to={`/chat/${createConversationName(user.username, c.other_user.username)}`}
          key={c.other_user.username}
        >
          <div className="border border-gray-200 w-full p-3">
            <h3 className="text-xl font-semibold text-gray-800">{c.other_user.username}</h3>
            <div className="flex justify-between">
              <p className="text-gray-700">{c.last_message?.content}</p>
              <p className="text-gray-700">{formatMessageTimestamp(c.last_message?.timestamp)}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ActiveConversations;