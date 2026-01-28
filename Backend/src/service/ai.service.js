/**
 * AI Service using Groq API
 * Documentation: https://console.groq.com/docs/api-reference
 */

async function generateResponse(chatHistory) {
  try {
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is missing in .env file");
    }

    console.log("[AI Service] Sending request to Groq...");

    // Convert Google SDK format to OpenAI format (required by Groq)
    // Input: { role: "user/model", parts: [{ text: "..." }] }
    // Output: { role: "user/assistant", content: "..." }
    const messages = chatHistory.map(msg => ({
      role: msg.role === "model" ? "assistant" : "user",
      content: msg.parts[0].text
    }));

    // Groq API Endpoint
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Updated to supported model
        messages: messages,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[AI Service] Groq Error:", data);
      throw new Error(data.error?.message || `Groq API error: ${response.status}`);
    }

    console.log("[AI Service] Response received successfully");
    return data.choices[0].message.content;

  } catch (error) {
    console.error("[AI Service] Error:", error.message);
    throw error;
  }
}

module.exports = generateResponse;
