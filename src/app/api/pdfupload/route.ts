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

async function parsePdfBuffer(buffer: Buffer): Promise<string[]> {
  const items: string[] = [];
  return new Promise((resolve, reject) => {
    new PdfReader({}).parseBuffer(buffer, (err, item) => {
      if (err) reject(err);
      else if (!item) resolve(items);
      else if (item.text) items.push(item.text);
    });
  });
}

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  // const { prompt } = await req.json();
  const formData = await req.formData();

  const file = formData.get("file") as Blob | null;
  if (!file) {
    return NextResponse.json({ message: "File not uploaded" });
  }

  const items = await parsePdfBuffer(Buffer.from(await file.arrayBuffer()));

  const allText = items.join("");

  return NextResponse.json({ text: allText });
}
