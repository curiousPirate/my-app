import { useState } from "react";
import { ChatGPTAPI } from "chatgpt";

function MusicSearch() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const searchMusic = async () => {
    const chatClient = new ChatGPTAPI({
      apiKey: "sk-...mL6K", // Replace with your API key
      chatTitle: "Songs Similar to " + input,
      defaultMessages: [input], // Pass the input as the default message for the bot
    });

    chatClient.on("sendMessage", async (message) => {
      if (message.author === "user") {
        const response = await fetch("https://api.openai.com/v1/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer sk-...mL6K", // Replace with your API key
          },
          body: JSON.stringify({
            prompt: "Songs similar to " + message.text + ":",
            max_tokens: 10,
            n: 1,
          }),
        });
        const data = await response.json();
        const songs = data.choices[0].text.split(",");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            author: "bot",
            text: "Here are some songs similar to " + message.text + ":",
          },
          ...songs.map((song) => ({ author: "bot", text: song.trim() })),
        ]);
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    searchMusic();
  };

  return (
    <div>
      <h1>Music Search</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="song-input">Enter a song name:</label>
        <input
          type="text"
          id="song-input"
          name="song-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {messages.map((message, index) => (
        <p key={index} className={message.author}>
          {message.text}
        </p>
      ))}
    </div>
  );
}

export default MusicSearch;
