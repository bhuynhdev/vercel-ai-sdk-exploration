import { OpenAI } from "openai";
import PDFParser from "pdf2json";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { PdfReader } from "pdfreader";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type MessageRole = OpenAI.Chat.Completions.ChatCompletionMessage["role"];

function buildPrompt(resumeText: string): OpenAI.Chat.Completions.ChatCompletionMessage[] {
  const resumeContent = resumeText.split("\n").map((message) => ({
    role: "user" as MessageRole,
    content: message
  }));

  const inquires = [
    {
      role: "user" as MessageRole,
      content: "Generate a LinkedIn About section"
    }
  ];

  const systemMessages = [
    {
      role: "system" as MessageRole,
      content: "You are a helpful college mentor. Below is a resume of a student. Read it"
    }
  ];

  return systemMessages.concat(resumeContent).concat(inquires);
}

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  // const { prompt } = await req.json();
  const { prompt } = await req.json();

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    stream: true,
    messages: buildPrompt(prompt),
    max_tokens: 500,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1
  });

  // // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // // Respond with the stream
  return new StreamingTextResponse(stream);
}
