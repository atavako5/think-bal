"use client";
import "regenerator-runtime/runtime";
import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const questions = [
  {
    step: 1,
    category: "Step 1: Check in with anxiety alarm system!",
    question:
      "What are you thoughts focused on? What is your alarm system alerting you to?",
    footnote:
      "Take a moment to acknowldge the heads up. Perhaps it reflects your lived experience?",
  },
  {
    step: 1,
    category: "Step 1: Check in with anxiety alarm system!",
    question: "What anxiety symptoms/sensations are you experiencing?",
    footnote:
      "Your worry brain is doing its job. Extend acceptance and appreciation. As best as you can!",
  },
  {
    step: 2,
    category: "Step 2: Steady yourself using your breath, body, & behaviour",
    question: "Focus on your breath, body/posture, and actions with the goal of calming yourself so you can think wisely.",
    footnote: "Breath deeply, to the bottom of your lungs with every breath.",
  },
  {
    step: 2,
    category: "Step 2: Steady yourself using your breath, body, & behaviour",
    question: "Use opposite Action- actions which are opposite to the effect strong emotions are having on us- actions which tend to have a helpful steadying effect!",
    footnote: "You may need to slow your breathing if it's too fast. or perhaps you've braced yourself, and stopped breathing. Figure out what you need to do to steady your breath and heart rate.",
  },
  {
    step: 2,
    category: "Step 2: Steady yourself using your breath, body, & behaviour",
    question: "Now take a moment to pay attention to your body. Are you carrying tension in your body? do you need to strech out certain muscles? your hands? jaw? shoulders?",
    footnote: "Now reflect on your behaviour. would you benefit from moving? or perhaps, from moving more slowly to steady yourself?",
  },
  {
    step: 3,
    category: "Step 3: Guide your thinking so you can be wise and balanced in your thoughts and actions - engage your frontal lobe!",
    question: "What is likely to happen?",
    footnote: "Your anxiety system has likely alerted you to the risks and the worst-case case scenarios. That is helpful!\n\nBut what is in fact likely to happen?\n\nwhat is the likely outcomes?",
  },
  {
    step: 3,
    category: "Step 3: Guide your thinking so you can be wise and balanced in your thoughts and actions - engage your frontal lobe!",
    question: "What skills & talents do I and others around me bring to this problem?",
    footnote: "Reflect on your strengths and the strengths of others around you",
  },
  {
    step: 3,
    category: "Step 3: Guide your thinking so you can be wise and balanced in your thoughts and actions - engage your frontal lobe!",
    question: "What are my values and goals here?",
    footnote: "What brings me to this spot? Why am I here?",
  },
  {
    step: 4,
    category: "Step 4: Develop your stance, or way of being as you approach this important situation",
    question: "How do you I want to handle myself?",
    footnote: "Can you find words, an image, or a memory which captures how you would like to feel in your body and how you would like to act?",
  },
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill("")
  );
  const [lockedAnswer, setLockedAnswer] = useState<string>("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = lockedAnswer + " " + transcript;
    setAnswers(newAnswers);
  }, [transcript]);

  const handleNext = () => {
    if (currentQuestion < questions.length + 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  if (currentQuestion >= questions.length) {
    const copyToClipboard = () => {
      const currentDate = new Date().toLocaleString();
      const summaryText = `Summary generated on: ${currentDate}\n\n` + answers
      .map((answer, index) => `Step ${questions[index].step}: ${questions[index].question}\nAnswer: ${answer}\n`)
      .join("\n");
      navigator.clipboard.writeText(summaryText);
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-black p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        {answers.map((answer, index) => (
        <div key={index} className="mb-4">
          <p className="question text-md mb-2">
          Step {questions[index].step}: {questions[index].question}
          </p>
          <p className="answer text-lg font-semibold text-green-500">{answer}</p>
        </div>
        ))}
        <div className="flex space-x-2">
        <button
          className="bg-blue-500 text-green py-2 px-4 rounded"
          onClick={() => {
          setCurrentQuestion(0);
          setAnswers(Array(questions.length).fill(""));
          }}
        >
          Start Over
        </button>
        <button
          className="bg-blue-500 text-green py-2 px-4 rounded"
          onClick={copyToClipboard}
        >
          Copy to Clipboard
        </button>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-black p-8 rounded shadow-md w-full max-w-md">
        <p className="category text-lg font-semibold mb-2">
          {questions[currentQuestion].category}
        </p>
        <p className="question text-lg font-semibold mb-4">
          {questions[currentQuestion].question}
        </p>
        <p className="footnote text-sm text-gray-500 mb-4">
          {questions[currentQuestion].footnote}
        </p>
        <textarea
          className="input bg-black w-full p-2 border border-gray-300 rounded mb-4"
          value={answers[currentQuestion]}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={4}
        />
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => {
              if (listening) {
                SpeechRecognition.stopListening();
              } else {
                setLockedAnswer(answers[currentQuestion]);
                SpeechRecognition.startListening();
              }
            }}
          >
            {listening ? (
              <svg
                className="h-8 w-8 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />{" "}
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />{" "}
                <line x1="12" y1="19" x2="12" y2="23" />{" "}
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            ) : (
              <svg
                className="h-8 w-8 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <line x1="1" y1="1" x2="23" y2="23" />{" "}
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />{" "}
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />{" "}
                <line x1="12" y1="19" x2="12" y2="23" />{" "}
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </button>
          <button onClick={resetTranscript}>
            <svg
              className="h-8 w-8 text-cyan-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
            </svg>
          </button>
        </div>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
            onClick={handleNext}
            disabled={currentQuestion === questions.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
