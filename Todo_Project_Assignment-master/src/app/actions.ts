'use server';

import type { Todo } from '@/types';
import { summarizeTodos } from '@/ai/flows/summarize-todos';

interface SlackResponse {
  success: boolean;
  message: string;
  summary?: string;
}

export async function handleSummarizeAndSendToSlack(todos: Todo[]): Promise<SlackResponse> {
  const pendingTodos = todos.filter(todo => !todo.completed);

  if (pendingTodos.length === 0) {
    return { success: true, message: "No pending tasks to summarize.", summary: "No pending tasks." };
  }

  try {
    const aiSummary = await summarizeTodos({ todos: pendingTodos });
    const summaryText = aiSummary.summary;

    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      console.error("SLACK_WEBHOOK_URL is not set in environment variables.");
      return { success: false, message: "Slack integration is not configured (webhook URL missing)." };
    }

    const slackPayload = {
      text: `📝 *Task Summary from TaskFlow AI*:\n${summaryText}`,
    };

    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Slack API error: ${response.status} ${errorText}`);
      return { success: false, message: `Failed to send summary to Slack. Status: ${response.status}` };
    }

    return { success: true, message: "Summary sent to Slack successfully!", summary: summaryText };

  } catch (error) {
    console.error("Error in handleSummarizeAndSendToSlack:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, message: `Error generating summary or sending to Slack: ${errorMessage}` };
  }
}
