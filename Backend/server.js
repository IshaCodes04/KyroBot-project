require("dotenv").config();
const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/service/ai.service");
const connectDB = require("./src/config/db");

// Connect to Database
connectDB();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173", "https://kyrobot.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

console.log('🚀 Socket.IO server initializing...');

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("✅ New user connected with ID:", socket.id);
  console.log("Total connected clients:", io.engine.clientsCount);

  socket.emit("test-connection", "Connection established successfully!");

  socket.on("ai-message", async (data) => {
    console.log("📥 Received ai-message event");
    console.log("Data received:", JSON.stringify(data, null, 2));

    try {
      const userMessage = data.message || data;
      const dateContext = data.dateContext;

      console.log("Processing message:", userMessage);
      console.log("Date context:", dateContext);

      if (!userMessage) {
        console.log("❌ No message content found");
        socket.emit("ai-message-response", "No message received");
        return;
      }

      // Add system message with date context if available
      if (dateContext && chatHistory.length === 0) {
        chatHistory.push({
          role: "user",
          parts: [{
            text: `System Info: Today is ${dateContext.fullDate}. Current time is ${dateContext.time}. Always be aware of this date and time when answering questions about dates, days, or time-related queries.`
          }]
        });

        chatHistory.push({
          role: "model",
          parts: [{ text: "Understood. I'm now aware of the current date and time." }]
        });
      }

      // Add user message to chat history
      chatHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
      });

      console.log("🤖 Generating AI response...");
      const response = await generateResponse(chatHistory);
      console.log("AI Response generated:", response);

      // Add AI response to history
      chatHistory.push({
        role: "model",
        parts: [{ text: response }]
      });

      console.log("📤 Sending response back to client");
      socket.emit("ai-message-response", response);

    } catch (error) {
      console.error("❌ Error in ai-message handler:", error);
      socket.emit("ai-message-response", "Sorry, I encountered an error. Please try again.");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ User disconnected:", socket.id, "Reason:", reason);
    console.log("Remaining clients:", io.engine.clientsCount);
  });

  socket.on("error", (error) => {
    console.error("🚫 Socket error:", error);
  });
});

io.on("connect_error", (error) => {
  console.error("🚫 Server connection error:", error);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("Socket.IO server is ready for connections");
});