import { generateText, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

// Define request schema
const requestSchema = z.object({
  prompt: z.string().min(1).max(1000),
  apiKey: z.string().optional().default(""),
});

type RequestType = z.infer<typeof requestSchema>;

// Create a new ratelimiter, that allows 3 requests per week
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "7 d"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request): Promise<Response> {
  try {
    // Get IP address from request
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Validate request body
    const body = await req.json();
    const { prompt, apiKey } = requestSchema.parse(body);

    // Check rate limit for non-API key users
    if (!apiKey) {
      const { success, remaining } = await ratelimit.limit(ip);
      if (!success) {
        return new Response(
          JSON.stringify({
            error:
              "You have used all your free generations. Please provide an API key to continue.",
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Initialize OpenAI client
    const openai = createOpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    // Generate base   prompt
    const baseResult = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Create a   prompt for: ${prompt}

Start directly with:
1. Role and Purpose Definition:

Then continue with the following sections:
2. Core Competencies and Knowledge Areas
3. Communication Style and Tone
4. Response Format and Structure
5. Specific Guidelines and Constraints
6. Error Handling and Edge Cases
7. Examples of Good Responses
8. Quality Standards and Requirements

Important: Do not add any title/header at the start or any concluding/summary text at the end.`,
      temperature: 0.7,
      maxTokens: 2000,
       :
        "You are an expert at creating   prompts. Generate the content exactly as requested, starting directly with '1. Role and Purpose Definition:' and ending with the last item in Quality Standards. Do not add any text before or after these sections.",
    });

    // Stream the enhanced result
    const result = streamText({
      model: openai("gpt-4o-mini"),
      prompt: `Enhance this   prompt to be more comprehensive and effective, while maintaining its exact structure:

${baseResult.text}

Make these improvements:
- Make instructions more specific and actionable
- Add edge cases and boundary conditions
- Include more diverse examples
- Strengthen quality control measures
- Add interaction guidelines
- Improve clarity and structure

Important: Keep the exact same format. Start directly with '1. Role and Purpose Definition:' and end with the last point in section 8. Do not add any title at the start or concluding text at the end.`,
      temperature: 0.7,
      maxTokens: 2500,
       :
        "You are an expert at refining   prompts. Enhance the content while maintaining the exact structure. Start directly with '1. Role and Purpose Definition:' and end with the last point in section 8. Do not add any additional text before or after these sections.",
    });

    const stream = result.toDataStreamResponse();

    return new Response(stream.body, {
      headers: {
        ...stream.headers,
        "X-Remaining-Generations": apiKey
          ? "unlimited"
          : (await ratelimit.limit(ip)).remaining.toString(),
      },
      status: stream.status,
      statusText: stream.statusText,
    });
  } catch (error) {
    console.error("Error processing request:", error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid request format",
          details: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle unknown errors
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
        message: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
