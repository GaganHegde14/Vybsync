import React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import SendIcon from "@mui/icons-material/Send";

export default function MessageInput({
  textAreaValue,
  setTextAreaValue,
  onSubmit,
  onTyping,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
    onTyping(); // Emit typing event on key press
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="Type a message..."
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
          onKeyDown={handleKeyDown}
          minRows={1}
          maxRows={3}
          endDecorator={
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                pt: 1,
              }}
            >
              <Button type="submit" size="sm" endIcon={<SendIcon />}>
                Send
              </Button>
            </Box>
          }
          sx={{
            minWidth: 300,
          }}
        />
      </form>
    </Box>
  );
}
