import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoWidgetProps {
  initialTodos?: Todo[];
}

// todo: remove mock functionality
const defaultTodos: Todo[] = [
  { id: "1", text: "Complete calculus homework", completed: false },
  { id: "2", text: "Attend study group at 3pm", completed: true },
  { id: "3", text: "Review notes for quiz", completed: false },
];

export function TodoWidget({ initialTodos = defaultTodos }: TodoWidgetProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: newTodo.trim(), completed: false },
      ]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <Card data-testid="todo-widget">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">My To-Do List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            data-testid="input-new-todo"
          />
          <Button size="icon" onClick={addTodo} data-testid="button-add-todo">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-2 p-2 rounded-md hover-elevate bg-muted/50"
              data-testid={`todo-item-${todo.id}`}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                data-testid={`checkbox-todo-${todo.id}`}
              />
              <span
                className={`flex-1 text-sm ${
                  todo.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {todo.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeTodo(todo.id)}
                data-testid={`button-remove-todo-${todo.id}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {todos.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No tasks yet. Add one above!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
