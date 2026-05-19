'use server';
 
import { generateText, Output } from 'ai';
import { z } from 'zod';
 
// TODO: Define the structure for our summary
// Create a Zod schema with these fields:
// - headline (string)
// - context (string)
// - discussionPoints (string)
// - takeaways (string)
 
const summarySchema = z.object({
  headline: z.string().describe('A concise headline summarizing the main point.'),
  context: z.string().describe('The background information or context for the summary.'),
  discussionPoints: z.string().describe('Key points discussed in the comments.'),
  takeaways: z.string().describe('Important conclusions or action items derived from the discussion.')
});
 
export const generateSummary = async (comments: any[]) => {
	console.log("Generating summary for", comments.length, "comments...");
	const { output: summary } = await generateText({
		model: "openai/gpt-5-mini",
		prompt: `Please summarize the following comments concisely, focusing on key decisions and action items.
      Comments:
      ${JSON.stringify(comments)}`,
		output: Output.object({
			schema: summarySchema,
		}),
	});
	console.log("Summary generated:", summary);
	return summary;
};