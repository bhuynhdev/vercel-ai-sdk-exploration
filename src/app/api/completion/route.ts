import { OpenAI } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type MessageRole = OpenAI.Chat.Completions.ChatCompletionMessage["role"];

function buildPrompt(resumeText: string): OpenAI.Chat.Completions.ChatCompletionMessage[] {
  const systemMessages = [
    {
      role: "system" as MessageRole,
      content: "You are a helpful college mentor. Below is a resume of a student. Read it"
    }
  ];

  const resumeContent = [
    {
      role: "user" as MessageRole,
      content: resumeText
    }
  ];

  const inquires = [
    {
      role: "user" as MessageRole,
      content: "Generate a medium-length LinkedIn About section"
    }
  ];

  return systemMessages.concat(resumeContent).concat(inquires);
}

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    stream: true,
    messages: buildPrompt(prompt),
    max_tokens: 500,
    temperature: 0.9,
    top_p: 1,
    frequency_penalty: 1.5,
    presence_penalty: 1
  });

  // // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // // Respond with the stream
  return new StreamingTextResponse(stream);
}
