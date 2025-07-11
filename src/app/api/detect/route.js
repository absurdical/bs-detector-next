import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const body = await req.json();
  const { text, level } = body;

  let systemPrompt = `
You are a professional BS detector.
Rate the following text on a scale of 1–10 for "BS Level" (1 = very clear, 10 = full of meaningless jargon).
Then explain your reasoning concisely.
Finally, translate the text into clear, plain, and direct language ("real talk") — written in the blistering, brutally honest, darkly funny, merciless style of a stand-up comedian blending the wit and tone of Bill Burr, George Carlin, Gary Gulman, Bill Hicks, and Greg Geraldo.

Output the result as a VALID JSON object like this:
{
  "rating": <integer>,
  "reason": "<string>",
  "real_talk": "<string>"
}

Do not include anything outside of the JSON.
`;

  if (level === "easy") {
    systemPrompt += "\nBe forgiving and allow for some fluff.";
  } else if (level === "hard") {
    systemPrompt += "\nBe extremely strict and allow no fluff at all.";
  } else {
    systemPrompt += "\nBe reasonably strict.";
  }

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
    temperature: 0,
    max_tokens: 500,
  });

  const content = chatCompletion.choices[0].message.content;

  return Response.json(JSON.parse(content));
}
