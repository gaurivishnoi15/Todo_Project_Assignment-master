import { ListChecks } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 mb-8">
      <div className="container mx-auto flex items-center justify-center">
        <ListChecks className="h-10 w-10 mr-3 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">TaskFlow AI</h1>
      </div>
    </header>
  );
}
