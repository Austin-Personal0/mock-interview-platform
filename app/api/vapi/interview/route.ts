import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { db } from "@/firebase/admin";

// Initialize the Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Vapi sends different types of messages
    // We need to handle function-call messages which contain the transcript
    const { type, message, functionCall } = body;
    
    // Log for debugging
    console.log("Vapi webhook received:", { type, message });
    
    // Handle different Vapi event types
    if (type === "function-call") {
      // This is where Vapi asks our server for the next response
      const { name, parameters } = functionCall;
      
      if (name === "onInterviewEnd") {
        // Interview has ended - save feedback
        return handleInterviewEnd(parameters);
      }
      
      if (name === "getNextQuestion" || name === "onSpeechEnd") {
        // Get the next question based on transcript
        return handleGetNextQuestion(parameters, body);
      }
    }
    
    // For any other type of message, just acknowledge
    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("Error in Vapi webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Handle getting the next interview question based on transcript
async function handleGetNextQuestion(parameters: any, fullBody: any) {
  try {
    const { transcript, questions, currentQuestionIndex, role, level, techstack } = parameters;
    
    // Get the full conversation transcript from the message
    const conversation = fullBody.message?.transcript || transcript || [];
    
    // Get current question index (default to 0)
    const questionIndex = currentQuestionIndex || 0;
    
    // Get the current question from the questions array
    const currentQuestion = questions?.[questionIndex] || "Tell me about yourself.";
    
    // Build conversation context
    let conversationContext = "";
    if (Array.isArray(conversation) && conversation.length > 0) {
      conversationContext = conversation
        .map((msg: any) => `${msg.role}: ${msg.content}`)
        .join("\n");
    }
    
    // Generate AI response using GoogleGenAI
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are an AI interviewer conducting a mock interview.
        
        Job Role: ${role || "Software Engineer"}
        Experience Level: ${level || "Mid-level"}
        Tech Stack: ${techstack || "General programming"}
        
        Current Question: ${currentQuestion}
        
        Previous Conversation:
        ${conversationContext}
        
        Instructions:
        1. Listen to the user's answer and evaluate it briefly in your mind
        2. Provide a natural follow-up or transition to the next question
        3. If the user has answered the current question well, move to the next question
        4. Keep your response conversational and under 2-3 sentences
        5. Do NOT repeat the full question unless necessary
        6. If this is the first question, introduce yourself and ask: "${currentQuestion}"
        
        Return your response in a natural, conversational way that flows well as a spoken interview.
      `,
    });
    
    const aiResponse = response.text || "Thank you for your answer. Let's continue with the next question.";
    
    // Determine if we should move to next question or end
    const nextQuestionIndex = questionIndex + 1;
    const hasMoreQuestions = questions && nextQuestionIndex < questions.length;
    const nextQuestion = hasMoreQuestions ? questions[nextQuestionIndex] : null;
    
    return NextResponse.json({
      response: aiResponse,
      nextQuestion: nextQuestion,
      questionIndex: nextQuestionIndex,
      shouldEnd: !hasMoreQuestions,
      continueInterview: hasMoreQuestions,
    });
  } catch (error: any) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      {
        response: "Thank you for your answer. Let's move to the next question.",
        questionIndex: (parameters.currentQuestionIndex || 0) + 1,
        shouldEnd: false,
      },
      { status: 200 }
    );
  }
}

// Handle interview completion - save feedback
async function handleInterviewEnd(parameters: any) {
  try {
    const { transcript, interviewId, userId, questions } = parameters;
    
    // Save the interview transcript to Firestore
    if (interviewId) {
      await db.collection("interviews").doc(interviewId).update({
        transcript: transcript || [],
        completedAt: new Date().toISOString(),
        status: "completed",
      });
    }
    
    // Generate AI feedback using GoogleGenAI
    const feedbackResponseResult = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are an expert interviewer providing feedback on a mock interview.
        
        Interview Questions:
        ${(questions || []).map((q: string, i: number) => `${i + 1}. ${q}`).join("\n")}
        
        Conversation Transcript:
        ${transcript.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")}
        
        Please provide a brief feedback summary including:
        1. Overall impression (1-2 sentences)
        2. Key strengths demonstrated
        3. Areas for improvement
        4. Suggested next steps
        
        Keep your feedback concise and actionable.
      `,
    });
    
    const feedbackResponse = feedbackResponseResult.text;
    
    // Save feedback to Firestore
    if (interviewId && userId) {
      await db.collection("feedback").add({
        interviewId,
        userId,
        transcript: transcript,
        questions: questions || [],
        feedback: feedbackResponse,
        createdAt: new Date().toISOString(),
      });
    }
    
    return NextResponse.json({
      success: true,
      message: "Interview completed",
      feedback: feedbackResponse,
    });
  } catch (error: any) {
    console.error("Error handling interview end:", error);
    return NextResponse.json(
      {
        success: true,
        message: "Interview ended (with errors in feedback generation)",
      },
      { status: 200 }
    );
  }
}

// Handle Vapi's GET request for health check
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      message: "Vapi interview webhook is running",
    },
    { status: 200 }
  );
}
