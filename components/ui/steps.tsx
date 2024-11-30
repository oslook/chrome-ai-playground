import { LucideIcon } from 'lucide-react';

interface StepProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

export function Step({ icon: Icon, title, children }: StepProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <div className="bg-primary/10 p-1 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="ml-8">
        {children}
      </div>
    </div>
  );
}

interface StepsProps {
  children: React.ReactNode;
}

export function Steps({ children }: StepsProps) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}
