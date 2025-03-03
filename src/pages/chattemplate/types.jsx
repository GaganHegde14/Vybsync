import React from "react";

function Chat({ chat }) {
  return (
    <div>
      <div>
        <span>{chat.sender.name}</span>
        <span>{chat.sender.username}</span>
        <span>{chat.sender.avatar}</span>
        <span>{chat.sender.online ? "Online" : "Offline"}</span>
      </div>
      <div>
        {chat.messages.map((message) => (
          <div key={message.id}>
            <span>
              {typeof message.sender === "string"
                ? message.sender
                : message.sender.name}
            </span>
            <span>{message.content}</span>
            <span>{message.timestamp}</span>
            <span>{message.unread ? "Unread" : ""}</span>
            {message.attachment && (
              <span>
                {message.attachment.fileName} {message.attachment.type}{" "}
                {message.attachment.size}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
