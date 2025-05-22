"use client";

import { useState, useEffect } from 'react';
import type { Todo } from '@/types';
import { Header } from '@/components/layout/Header';
import { AddTaskForm } from '@/components/tasks/AddTaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { handleSummarizeAndSendToSlack } from './actions';
import { Bot, Send, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load todos from localStorage on initial render
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
        // Ensure createdAt is a Date object
        const todosWithDateObjects = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        setTodos(todosWithDateObjects);
      } catch (error) {
        console.error("Failed to parse todos from localStorage", error);
        setTodos([]);
      }
    }
  }, []);

  useEffect(() => {
    // Save todos to localStorage whenever they change
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTask = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos((prevTodos) => [...prevTodos, newTodo].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTask = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({
      title: "Task Deleted",
      description: "The task has been successfully removed.",
    });
  };

  const handleSummarize = async () => {
    setIsLoadingSummary(true);
    const result = await handleSummarizeAndSendToSlack(todos);
    setIsLoadingSummary(false);

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };
  
  const pendingTasksCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 py-8 selection:bg-primary/20">
      <Header />
      <main className="container mx-auto max-w-2xl w-full space-y-8">
        <Card className="shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Task</CardTitle>
            <CardDescription>What do you need to get done?</CardDescription>
          </CardHeader>
          <CardContent>
            <AddTaskForm onAddTask={addTask} />
          </CardContent>
        </Card>

        <TaskList
          todos={todos}
          onToggleComplete={toggleComplete}
          onDeleteTask={deleteTask}
        />
        
        <Separator />

        <Card className="shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Bot className="mr-3 h-7 w-7 text-accent" />
              AI Summary & Slack
            </CardTitle>
            <CardDescription>
              Generate an AI summary of your pending tasks and send it to Slack.
              {pendingTasksCount === 0 && todos.length > 0 && (
                <span className="block mt-1 text-green-600 font-medium">All tasks completed! Nothing to summarize.</span>
              )}
              {pendingTasksCount > 0 && (
                <span className="block mt-1 text-accent font-medium">{pendingTasksCount} pending task(s).</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={handleSummarize} 
              disabled={isLoadingSummary || pendingTasksCount === 0}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              aria-label="Generate summary and send to Slack"
            >
              {isLoadingSummary ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              Generate & Send Summary
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
