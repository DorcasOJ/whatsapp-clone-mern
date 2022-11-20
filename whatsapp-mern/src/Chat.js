import SearchRounded from "@mui/icons-material/SearchRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import { Avatar, IconButton } from "@mui/material";
import React, { useState } from "react";
import "./Chat.css";
import MoreVertRounded from "@mui/icons-material/MoreVertRounded";
import AddReactionRoundedIcon from "@mui/icons-material/AddReactionRounded";
import axios from './axios';

function Chat({ messages }) {
  const [input, setInput] = useState("");
  const sendMessage = (e) => {
    e.preventDefault();
    axios.post('/messages/new', {
      message: input,
      name: 'WHATSAPP DEMO',
      timestamp: 'Just now',
      received:  false
    })

    setInput('');
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />

        <div className="chat__headerInfo">
          <h3>Room name</h3>
          <p>Last seen at ...</p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchRounded />
          </IconButton>
          <IconButton>
            <AttachFileRoundedIcon />
          </IconButton>
          <IconButton>
            <MoreVertRounded />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${message.received && "chat__receiver"}`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">{message.timestamp}</span>
          </p>
        ))}

        <p className="chat__message chat__receiver">
          <span className="chat__name">Dorcas</span>
          This is a message
          <span className="chat__timestamp">{new Date().toUTCString()}</span>
        </p>
      </div>

      <div className="chat__footer">
        <AddReactionRoundedIcon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
