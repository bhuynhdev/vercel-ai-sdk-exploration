"use client";

import { useCompletion } from "ai/react";
import { ChangeEvent, FormEventHandler, useState } from "react";

export default function Page() {
  const { completion, complete } = useCompletion({
    api: "/api/completion"
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      console.warn("no file was chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("files list is empty");
      return;
    }

    setUploadedFile(fileInput.files[0]);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      return console.warn("No file chosen");
    }

    const formData = new FormData();
    formData.append("file", uploadedFile, "resume.pdf");
    try {
      const res = await fetch("/api/pdfupload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        console.error("something went wrong, check your console.");
        return;
      }

      const { text } = await res.json();

      // AI helper from vercel
      complete(text);
    } catch (error) {
      console.error("something went wrong, check your console.");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Submit PDF file</label>
        <input required type="file" onChange={onFileChange} />
        <button type="submit">Send</button>
      </form>
      <p>Response: {completion}</p>
    </div>
  );
}
