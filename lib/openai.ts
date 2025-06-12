// import OpenAI from "openai";

// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// console.log("OpenAI API key loaded:", process.env.OPENAI_API_KEY);

// lib/openai.ts
import OpenAI from "openai";

console.log("✅ openai.ts loaded");

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("🔑 API KEY:", process.env.OPENAI_API_KEY);
