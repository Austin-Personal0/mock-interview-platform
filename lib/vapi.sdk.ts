import Vapi from "@vapi-ai/web";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { finalize } from "zod/v4/core";
import { getRandomInterviewCover } from "./utils";
import { db } from "@/firebase/admin";

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);
