'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, CircleDashed, Circle, BookCopy } from 'lucide-react';
import type { Surah, SurahStatus } from '@/lib/quran-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from './ui/badge';


interface SurahCardProps {
  surah: Surah;
  isEditable: boolean;
  onStatusChange?: (id: number, status: SurahStatus) => void;
}

const statusConfig = {
  'strong-memorization': {
    icon: CheckCircle2,
    className: 'text-green-600 border-green-600/80 bg-green-600/5',
    label: 'Strong Memorization',
  },
  'needs-revision': {
    icon: BookCopy,
    className: 'text-orange-600 border-orange-600/80 bg-orange-600/5',
    label: 'Needs Revision',
  },
  'weak-memorization': {
    icon: CheckCircle2,
    className: 'text-accent border-accent/80 bg-accent/5',
    label: 'Weak Memorization',
  },
  'in-progress': {
    icon: CircleDashed,
    className: 'text-primary border-primary/80 bg-primary/5',
    label: 'In Progress',
  },
  'not-started': {
    icon: Circle,
    className: 'text-foreground/50 border-border bg-background',
    label: 'Not Started',
  },
};

export default function SurahCard({ surah, isEditable, onStatusChange }: SurahCardProps) {
  const config = statusConfig[surah.status] || statusConfig['not-started']; // Fallback to 'not-started' if status not found
  const Icon = config.icon;

  return (
    <Card className={cn("flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1", config.className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline text-xl">{surah.id}. {surah.name}</CardTitle>
          <Icon className="h-6 w-6 shrink-0" />
        </div>
        <CardDescription className="text-foreground/70">{surah.englishName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
         <div className="flex items-center space-x-4 text-sm text-foreground/80">
            <div className="flex items-center">
              <BookCopy className="mr-1.5 h-4 w-4" />
              {surah.numberOfAyahs} Ayahs
            </div>
            <Badge variant="outline" className="border-current">{surah.revelationType}</Badge>
          </div>
      </CardContent>
      <CardFooter>
        {isEditable ? (
          <div className="w-full">
            <Select 
              value={surah.status} 
              onValueChange={(value) => onStatusChange?.(surah.id, value as SurahStatus)}
            >
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="weak-memorization">Weak Memorization</SelectItem>
                <SelectItem value="needs-revision">Needs Revision</SelectItem>
                <SelectItem value="strong-memorization">Strong Memorization</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <p className="text-sm font-semibold">{config.label}</p>
        )}
      </CardFooter>
    </Card>
  );
}
