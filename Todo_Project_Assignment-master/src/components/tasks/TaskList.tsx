"use client";

import type { Todo } from '@/types';
import { TaskItem } from './TaskItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ todos, onToggleComplete, onDeleteTask }: TaskListProps) {
  if (todos.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No tasks yet. Add some!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] w-full">
          {todos.map((todo) => (
            <TaskItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
