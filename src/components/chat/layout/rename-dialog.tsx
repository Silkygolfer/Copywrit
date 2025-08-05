'use client'
import { useState, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Doc } from '../../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

// Validation schema for thread title
const threadTitleSchema = z.string()
  .min(1, 'Thread name cannot be empty')
  .max(30, 'Thread name cannot exceed 30 characters')
  .trim()

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  thread: Doc<'threads'> | null;
}

export function RenameDialog({ open, onOpenChange, thread }: RenameDialogProps) {
  const [value, setValue] = useState(thread?.title || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const renameThread = useMutation(api.threads.updateThreadTitle);

  useEffect(() => {
    if (open && thread) {
      setValue(thread.title);
      setError(null);
    }
  }, [open, thread]);

  const validateInput = (input: string): boolean => {
    try {
      threadTitleSchema.parse(input);
      setError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
    
    // Validate in real-time if input is getting close to limit
    if (newValue.length > 25) {
      validateInput(newValue);
    }
  };

  const handleRename = async () => {
    if (!validateInput(value)) {
      return;
    }

    setIsLoading(true);
    if (!thread) return;
    
    const result = await renameThread({
      threadId: thread._id,
      title: value.trim(),
    });
    
    if (result.success) {
      toast.success('Thread renamed successfully');
      setIsLoading(false);
      onOpenChange(false);
    } else {
      toast.error('Failed to rename thread');
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && value.trim() && !error) {
      handleRename();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => { if (!isLoading) onOpenChange(o); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Thread</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter thread name"
            autoFocus
            disabled={isLoading}
            className={error ? 'border-red-500' : ''}
          />
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {value.length}/30 characters
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
          <Button 
            type="submit" 
            onClick={handleRename} 
            disabled={isLoading || !value.trim() || !!error}
          >
            {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Renaming...</>) : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 