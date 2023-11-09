// @ts-nocheck
import { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import { UserModel } from "../models/User";
import { createConversationName } from "../utils";


interface UserResponse {
  username: string;
  name: string;
  url: string;
}

export function Conversations() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<UserResponse[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await axios.get('api/users/all/', {
        headers: {
          Authorization: `Token ${user?.token}`
        }
      });
      setUsers(data)
    }

    fetchUsers();
  }, [user]);

  return (
    <div>
      {users
        .filter((u: UserModel) => u.username !== user?.username)
        .map((u: UserModel) => (
          <Link
            to={`chat/${createConversationName(user.username, u.username)}`}
            key={u.username}
          >
            <div key={u.username}>{u.username}</div>
          </Link>
        ))}
    </div>
  );
}