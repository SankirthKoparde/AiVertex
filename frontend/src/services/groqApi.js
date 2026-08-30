/**
 * Voice AI Assistant Service for AI VARTEX with Full Conversational Memory
 */

const DEFAULT_SYSTEM_PROMPT = `You are VARTEX AI, a friendly, ultra-intelligent, highly engaging voice assistant for AI VARTEX — a premium AI & EdTech company specializing in Artificial Intelligence, Generative AI, Machine Learning, Prompt Engineering, AI Agents, and Data Science.
You maintain continuous conversational memory. Refer back to what the user said earlier in the conversation when appropriate.
Keep your spoken responses concise, natural, and clear (1-3 short sentences max) so it sounds like a human AI assistant speaking in real-time.`;

export const getGroqCompletion = async (userPrompt, conversationHistory = []) => {
  const key = import.meta.env.VITE_GROQ_API_KEY;

  // Format full multi-turn conversation messages array
  const formattedMessages = [
    { role: 'system', content: DEFAULT_SYSTEM_PROMPT },
    ...conversationHistory.slice(-10), // Include last 10 messages for deep context memory
    { role: 'user', content: userPrompt },
  ];

  if (!key) {
    return getSmartMemoryFallbackResponse(userPrompt, conversationHistory);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: formattedMessages,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return getSmartMemoryFallbackResponse(userPrompt, conversationHistory);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || getSmartMemoryFallbackResponse(userPrompt, conversationHistory);
  } catch (error) {
    return getSmartMemoryFallbackResponse(userPrompt, conversationHistory);
  }
};

const getSmartMemoryFallbackResponse = (userPrompt, conversationHistory) => {
  const lower = userPrompt.toLowerCase();
  const lastUserMsg = conversationHistory.filter(m => m.role === 'user').slice(-1)[0]?.content.toLowerCase() || '';

  if (lower.includes('my name is')) {
    const name = userPrompt.split(/my name is/i)[1]?.trim().split(' ')[0] || 'friend';
    return `Pleased to meet you, ${name}! I'll remember your name. How can I help you explore AI VARTEX today?`;
  }
  if (lower.includes('what is my name') || lower.includes('do you remember my name')) {
    const prevNameMsg = conversationHistory.find(m => m.content.toLowerCase().includes('my name is'));
    if (prevNameMsg) {
      const name = prevNameMsg.content.split(/my name is/i)[1]?.trim().split(' ')[0];
      return `Yes, I remember! Your name is ${name}.`;
    }
    return "You haven't told me your name yet! What should I call you?";
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello again! I am VARTEX AI. What topic in Artificial Intelligence or Data Science shall we discuss next?";
  }
  if (lower.includes('course') || lower.includes('learn') || lower.includes('study')) {
    return "At AI VARTEX, we offer cutting-edge courses in Generative AI, Machine Learning, Prompt Engineering, and AI Agents.";
  }

  return "I understand! AI VARTEX is designed to empower you with practical AI skills and real-world project mastery. What else would you like to explore?";
};
