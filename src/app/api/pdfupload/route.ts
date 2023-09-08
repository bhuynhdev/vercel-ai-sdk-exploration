import { PdfReader } from "pdfreader";
import { NextResponse } from "next/server";

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
