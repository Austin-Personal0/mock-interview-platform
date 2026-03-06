"use client";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { LoaderCircle } from "lucide-react";
import React, { Activity, useState } from "react";

const Page = () => {
  const [disabled, setDisabled] = useState(false);
  const [ questions , setQuestions ] = useState<string[]>([])

  const runTest = async () => {
    setDisabled(true);

    try {
        const user = await getCurrentUser()
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers : { "Content-Type" : "application/json"},
        body: JSON.stringify({
          type: "technical",
          role: "Frontend Developer",
          level: "Mid Senior",
          techstack: "Next JS , React , Typescript",
          amount: 5,
          userid : user?.id
        }),
      });

      const data = await response.json()
      setQuestions(data.data)
      setDisabled(false);

    } catch (error) {
        console.log(error)
        setDisabled(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full h-screen">
      <h1>Testing Gemini</h1>
      <Button
        disabled={disabled}
        onClick={runTest}
        className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
      >
        {
            disabled ? <LoaderCircle className="animate-spin text-white"/> : "Run Test"
        }
      </Button>
      <div>
        {
            disabled ? <p>Generating Questions</p> : <ul>
                {
                  questions && questions.map(
                    question => <li key={question}>{question}</li>
                  )  
                }
            </ul>
        }
      </div>
    </div>
  );
};

export default Page;
