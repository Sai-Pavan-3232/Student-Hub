import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateThreadDialogProps {
  onSubmit?: (data: {
    title: string;
    category: string;
    description: string;
    isAnonymous: boolean;
  }) => void;
}

export function CreateThreadDialog({ onSubmit }: CreateThreadDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmit = () => {
    if (title && category && description) {
      onSubmit?.({ title, category, description, isAnonymous });
      setOpen(false);
      setTitle("");
      setCategory("");
      setDescription("");
      setIsAnonymous(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-thread">
          <Plus className="h-4 w-4 mr-2" />
          New Thread
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Discussion Thread</DialogTitle>
          <DialogDescription>
            Start a new conversation with the community. Be respectful and follow community guidelines.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What do you want to discuss?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-thread-title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="select-thread-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="mental-health">Mental Health</SelectItem>
                <SelectItem value="clubs">Clubs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Share your thoughts, questions, or experiences..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="textarea-thread-description"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              data-testid="checkbox-anonymous"
            />
            <Label htmlFor="anonymous" className="text-sm font-normal">
              Post anonymously
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-thread">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !category || !description} data-testid="button-submit-thread">
            Create Thread
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
