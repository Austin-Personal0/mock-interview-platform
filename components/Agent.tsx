'use client'

import Image from "next/image";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { useRouter } from "next/navigation";
import { Loader, Phone, PhoneOffIcon } from "lucide-react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage{
  role : 'user' | 'system' | 'assistant' | 'bot'
  content : string
}

const Agent = ({ type, userName, userId, feedbackId }: AgentProps) => {

  const router = useRouter()

  const [isSpeaking , setIsSpeaking] = useState(false)
  const [ callStatus , setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [ messages , setMessages ] = useState<SavedMessage[]>([])
  const lastMessage = messages[messages.length - 1]

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED)

    const onMessage = (message: Message) => {
      if( message.type === 'transcript' && message.transcriptType === 'final' ){
        const newMessage = {
          role : message.role,
          content : message.transcript
        }

        setMessages( prev => [...prev , newMessage])
      }
    }

    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)

    const onError = ( error : Error) => console.log('Error' , error.message)

    vapi.on('call-start' , onCallStart)
    vapi.on("call-end" , onCallEnd)
    vapi.on('message' , onMessage)
    vapi.on('speech-start' , onSpeechStart)
    vapi.on('speech-end' , onSpeechEnd)
    vapi.on('error' , onError)

    return () => {
      vapi.off('call-start' , onCallStart)
      vapi.off("call-end" , onCallEnd)
      vapi.off('message' , onMessage)
      vapi.off('speech-start' , onSpeechStart)
      vapi.off('speech-end' , onSpeechEnd)
      vapi.off('error' , onError)
    }
  } , [])

  useEffect( () => {
    if( callStatus === CallStatus.FINISHED) router.push('/')
  } , [ messages , callStatus , userId , type ])

  const handleCall = async () => {
    console.log('Starting call' , callStatus)
    setCallStatus(CallStatus.CONNECTING)
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID , {
      firstMessage : `Hello ${userName} , and welcome to your interview. I will be asking you questions to assess your knowledge and skills. Please answer them to the best of your ability. Good luck!`	
    })
    console.log('Call started' , callStatus)
  }

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED)
    await vapi.stop()
  }
  
  const latestMessage = messages[messages.length - 1]?.content
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED

  return (
    <div className="gap-4">
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak"></span>}
          </div>

          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-30"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

        {
            messages.length > 0 && (
                <div className="transcript-border my-8">
                    <div className="transcript">
                        <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>{latestMessage}</p>
                    </div>
                </div>
            )
        }
      <div className="w-full flex justify-center mt-8">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call rounded-sm" onClick={handleCall}>
            <span className={cn('absolute animate-ping rounded-full opaity-75' , callStatus !== 'CONNECTING' && 'hidden')}/>
            
            <span>
            {isCallInactiveOrFinished
                ? <span className="flex flex-row items-center space-x-2">
                    <Phone color="#fff"/>
                    <p>Start Interview</p>
                </span>
                : <p className="flex flex-row items-center space-x-2">
                    <Loader className="animate-spin duration-700"/>
                    Interviewer is getting ready
                  </p>}
            </span>
            
          </button>
        ) : (
          <button className="btn-disconnect rounded-sm" onClick={handleDisconnect}>
            <span className="flex flex-row items-center space-x-2">
              <PhoneOffIcon/>
              <p>End Interview</p>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;
