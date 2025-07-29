
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const localQuiz = localStorage.getItem("quiz_json");
    if (localQuiz) {
      try {
        setQuestions(JSON.parse(localQuiz));
        return;
      } catch {}
    }
    fetch("/Cloud_IoT_Legal_Encryption_Quiz_100Qs.json")
      .then((res) => res.json())
      .then(setQuestions);
  }, []);

  if (!questions.length) {
    return <div className="flex justify-center items-center min-h-screen">Loading quiz...</div>;
  }

  const q = questions[current];

  function handleSelect(option) {
    setSelected(option);
    setShowAnswer(true);
    if (option === q.answer) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-2xl font-bold">Quiz Complete!</h1>
        <p className="text-lg">Your score: {score} / {questions.length}</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => {setCurrent(0);setScore(0);setFinished(false);}}>Restart</button>
      </div>
    );
  }

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== "application/json") {
      alert("Please upload a valid JSON file.");
      return;
    }
    f.text().then((text) => {
      try {
        setQuestions(JSON.parse(text));
        localStorage.setItem("quiz_json", text);
        setCurrent(0);
        setSelected(null);
        setShowAnswer(false);
        setScore(0);
        setFinished(false);
      } catch {
        alert("Invalid JSON format.");
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-xl justify-between items-center">
        <a href="/upload" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow">Upload Quiz JSON (Page)</a>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow">Upload Here</span>
          <input type="file" accept="application/json" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-10 border border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Question {current + 1} of {questions.length}</h2>
          <div className="w-32 h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <p className="mb-8 text-lg font-medium text-gray-800 dark:text-gray-100 text-center">{q.question}</p>
        <div className="flex flex-col gap-4">
          {q.options.map((option, idx) => {
            let btnClass = "px-6 py-3 rounded-lg border text-left transition-all text-base font-medium ";
            if (showAnswer) {
              if (option === q.answer) {
                btnClass += "bg-green-100 border-green-500 text-green-900";
              } else if (selected === option) {
                btnClass += "bg-red-100 border-red-500 text-red-900";
              } else {
                btnClass += "bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200";
              }
            } else {
              btnClass += "bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:bg-blue-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200";
            }
            return (
              <button
                key={option}
                className={btnClass}
                disabled={showAnswer}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            );
          })}
        </div>
        {showAnswer && (
          <div className="mt-8 flex flex-col items-center gap-4">
            {selected === q.answer ? (
              <span className="text-green-700 font-semibold text-lg">Correct!</span>
            ) : (
              <span className="text-red-700 font-semibold text-lg">Incorrect. Correct answer: <span className="text-green-700">{q.answer}</span></span>
            )}
            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-all" onClick={handleNext}>
              {current + 1 === questions.length ? "Finish" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
