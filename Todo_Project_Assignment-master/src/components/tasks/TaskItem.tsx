"use client";

import type { Todo } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskItem({ todo, onToggleComplete, onDeleteTask }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors duration-150 ease-in-out">
      <div className="flex items-center gap-3">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={() => onToggleComplete(todo.id)}
          aria-labelledby={`todo-text-${todo.id}`}
        />
        <label
          htmlFor={`todo-${todo.id}`}
          id={`todo-text-${todo.id}`}
          className={cn(
            "text-sm cursor-pointer",
            todo.completed ? "line-through text-muted-foreground" : "text-foreground"
          )}
        >
          {todo.text}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteTask(todo.id)}
        className="text-muted-foreground hover:text-destructive"
        aria-label={`Delete task: ${todo.text}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
