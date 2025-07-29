"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleFileChange(e) {
    setError("");
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== "application/json") {
      setError("Please upload a valid JSON file.");
      return;
    }
    setFile(f);
  }

  async function handleUpload() {
    if (!file) return;
    try {
      const text = await file.text();
      JSON.parse(text); // Validate JSON
      localStorage.setItem("quiz_json", text);
      router.push("/");
    } catch {
      setError("Invalid JSON format.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-10 border border-gray-200 dark:border-zinc-800 flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold mb-2">Upload Quiz JSON</h1>
        <input type="file" accept="application/json" onChange={handleFileChange} className="mb-2" />
        {error && <div className="text-red-600 font-medium">{error}</div>}
        <button
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-all"
          onClick={handleUpload}
          disabled={!file}
        >
          Upload & Show Quiz
        </button>
      </div>
    </div>
  );
}
