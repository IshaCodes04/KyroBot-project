/**
 * AI Service using OpenRouter API
 * Documentation: https://openrouter.ai/docs
 */

async function generateResponse(chatHistory) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is missing in .env file");
    }

    console.log("[AI Service] Sending request to OpenRouter...");

    // Convert Google SDK format to OpenAI format (required by OpenRouter)
    // Input: { role: "user/model", parts: [{ text: "..." }] }
    // Output: { role: "user/assistant", content: "..." }
    const messages = chatHistory.map(msg => ({
      role: msg.role === "model" ? "assistant" : "user",
      content: msg.parts[0].text
    }));

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Chatbot Project",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: messages,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[AI Service] OpenRouter Error:", data);

      if (response.status === 429) {
        return "The AI is currently busy. Please try again in a few moments.";
      }

      throw new Error(data.error?.message || `OpenRouter API error: ${response.status}`);
    }

    console.log("[AI Service] Response received successfully");
    return data.choices[0].message.content;

  } catch (error) {
    console.error("[AI Service] Error:", error.message);
    throw error;
  }
}

module.exports = generateResponse;
