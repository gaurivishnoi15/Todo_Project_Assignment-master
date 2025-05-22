# TaskFlow AI

TaskFlow AI is a Next.js application that helps you manage your personal to-do items. It features AI-powered summarization of pending tasks and can send these summaries to a configured Slack channel.

## Features

- **Task Management**: Add, view, mark as complete, and delete to-do items.
- **AI Task Summarization**: Uses a Large Language Model (LLM) to generate a meaningful summary of your pending tasks.
- **Slack Integration**: Automatically sends the generated task summary to a pre-configured Slack channel.
- **Status Notifications**: Displays success or failure messages for operations like sending summaries to Slack.

## Tech Stack

- **Frontend**: Next.js (React)
- **Styling**: Tailwind CSS, ShadCN UI
- **AI Integration**: Genkit with Google AI (Gemini)
- **State Management**: React Hooks (client-side state with localStorage persistence)

## Getting Started

### Prerequisites

- Node.js (version 18.x or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd taskflow-ai 
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add your Slack Incoming Webhook URL:

    ```env
    SLACK_WEBHOOK_URL=your_slack_incoming_webhook_url_here
    ```

    **How to get a Slack Incoming Webhook URL:**
    1. Go to your Slack app's settings or create a new Slack app at [api.slack.com/apps](https://api.slack.com/apps).
    2. Navigate to "Incoming Webhooks" under "Features".
    3. Activate Incoming Webhooks.
    4. Click "Add New Webhook to Workspace".
    5. Choose a channel where the messages will be posted and click "Authorize".
    6. Copy the generated Webhook URL. This is your `SLACK_WEBHOOK_URL`.

    You may also need to configure Google AI API keys if you are modifying or running the Genkit flows directly. Refer to Genkit documentation for details. The pre-built `summarizeTodos` flow should work if the Google AI plugin is correctly configured in `src/ai/genkit.ts`.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will usually be available at `http://localhost:9002` (as per your `package.json` scripts).

## How to Use

1.  Open the application in your browser.
2.  **Add Tasks**: Use the input field to type your task and click "Add Task".
3.  **Manage Tasks**:
    *   Mark tasks as complete/incomplete using the checkboxes.
    *   Delete tasks using the trash icon.
4.  **Generate Summary**:
    *   Once you have pending tasks, click the "Generate & Send Summary" button.
    *   The AI will summarize your pending tasks.
    *   The summary will be posted to your configured Slack channel.
    *   You'll receive a notification in the app indicating success or failure.

## Project Structure

-   `src/app/`: Main application pages and layout.
    -   `page.tsx`: The main page for the to-do list application.
    -   `layout.tsx`: The root layout.
    -   `globals.css`: Global styles and Tailwind CSS configuration.
    -   `actions.ts`: Server Actions for backend logic (e.g., AI summarization, Slack posting).
-   `src/components/`: Reusable UI components.
    -   `layout/`: Layout-specific components (e.g., `Header.tsx`).
    -   `tasks/`: Components related to task management (e.g., `TaskItem.tsx`, `TaskList.tsx`, `AddTaskForm.tsx`).
    -   `ui/`: ShadCN UI components.
-   `src/ai/`: AI-related code, including Genkit flows.
    -   `flows/summarize-todos.ts`: The Genkit flow for summarizing to-do items.
-   `src/types/`: TypeScript type definitions (e.g., `index.ts` for `Todo` type).
-   `public/`: Static assets.

This project is designed to be a starting point. You can expand it by adding features like:
- User authentication
- Persistent database storage (e.g., Firebase Firestore, Supabase)
- More advanced task editing features
- Customizable Slack messages
- Different LLM providers or models
```