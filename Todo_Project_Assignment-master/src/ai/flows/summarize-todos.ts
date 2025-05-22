// Summarize todos and send to Slack.
'use server';

/**
 * @fileOverview Summarizes a list of todos using an LLM and sends the summary to a Slack channel.
 *
 * - summarizeTodos - A function that takes a list of todos and returns a summary of the pending tasks.
 * - SummarizeTodosInput - The input type for the summarizeTodos function.
 * - SummarizeTodosOutput - The return type for the summarizeTodos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTodosInputSchema = z.object({
  todos: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      completed: z.boolean(),
    })
  ).describe('A list of to-do items.'),
});
export type SummarizeTodosInput = z.infer<typeof SummarizeTodosInputSchema>;

const SummarizeTodosOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the pending to-do items.'),
  progress: z.string().describe('A short summary of the progress made.'),
});
export type SummarizeTodosOutput = z.infer<typeof SummarizeTodosOutputSchema>;

export async function summarizeTodos(input: SummarizeTodosInput): Promise<SummarizeTodosOutput> {
  return summarizeTodosFlow(input);
}

const summarizeTodosPrompt = ai.definePrompt({
  name: 'summarizeTodosPrompt',
  input: {schema: SummarizeTodosInputSchema},
  output: {schema: SummarizeTodosOutputSchema},
  prompt: `You are a personal assistant helping a user understand their priorities.

  Here is a list of to-do items:
  {{#each todos}}
  - {{text}} (Completed: {{completed}})
  {{/each}}

  Please provide a concise summary of the PENDING to-do items. Focus on what the user needs to do.
  Do not include completed tasks in the summary.
  Use no more than 50 words.
  `,
});

const summarizeTodosFlow = ai.defineFlow(
  {
    name: 'summarizeTodosFlow',
    inputSchema: SummarizeTodosInputSchema,
    outputSchema: SummarizeTodosOutputSchema,
  },
  async input => {
    const pendingTodos = input.todos.filter(todo => !todo.completed);

    // If all todos are completed, return a message indicating that.
    if (pendingTodos.length === 0) {
      return {
        summary: 'All tasks are completed!',
        progress: 'Generated summary of todos.',
      };
    }

    const {output} = await summarizeTodosPrompt({
      todos: pendingTodos,
    });

    return {
      ...output,
      progress: 'Generated summary of todos.',
    };
  }
);
