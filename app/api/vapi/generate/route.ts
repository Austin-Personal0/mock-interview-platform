import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET(){
    return Response.json({ success : true , data : 'Thanks'} , { status : 200})
}

export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userId } = await request.json();
  
    try {
      const { text: questions } = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt: `
                  The job role is ${role}
                  The job experience level is ${level}
                  The tech stack used in the job is: ${techstack}
                  The focus between behavioural and technical questions should lean towards: ${type}
                  The amount of questions required is: ${amount}
                  Please return only the questions, without any additional text.
                  The questions are going to be read by a voice assistant so do not use any special characters that might break the voice assistant.
                  Return the questions formatted like this:
                  ['Question 1','Question 2','Question 3']
  
                  Thank you
              `,
      });
  
      const interview = {
        role,
        type,
        level,
        techstack: techstack.split(","),
        questions: JSON.parse(questions),
        userId,
        finalized: true,
        coverImage: getRandomInterviewCover(),
        createdAt: new Date().toISOString(),
      };
  
      await db.collection('interviews').add(interview)
  
      return Response.json({success : true} , { status : 200 })
      
    } catch (error : any ) {
        return Response.json({
            success : false,
            error : `${error.message}`
        })
    }
  }
  