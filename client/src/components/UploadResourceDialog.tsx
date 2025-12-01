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
import { Upload, FileText } from "lucide-react";
import { useState } from "react";

interface UploadResourceDialogProps {
  onSubmit?: (data: {
    title: string;
    category: string;
    description: string;
    file?: File;
    url?: string;
  }) => void;
}

export function UploadResourceDialog({ onSubmit }: UploadResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [uploadType, setUploadType] = useState<"file" | "url">("file");

  const handleSubmit = () => {
    if (title && category && description && (file || url)) {
      onSubmit?.({
        title,
        category,
        description,
        file: file || undefined,
        url: url || undefined,
      });
      setOpen(false);
      setTitle("");
      setCategory("");
      setDescription("");
      setFile(null);
      setUrl("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-upload-resource">
          <Upload className="h-4 w-4 mr-2" />
          Upload Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload Resource</DialogTitle>
          <DialogDescription>
            Share study materials, notes, or helpful links with fellow students.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Calculus Study Guide"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-resource-title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="select-resource-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="study-materials">Study Materials</SelectItem>
                <SelectItem value="tips">Tips & Tricks</SelectItem>
                <SelectItem value="mental-health">Mental Health</SelectItem>
                <SelectItem value="academic-support">Academic Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this resource contains..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="textarea-resource-description"
            />
          </div>
          <div className="grid gap-2">
            <Label>Upload Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={uploadType === "file" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadType("file")}
                data-testid="button-upload-type-file"
              >
                File
              </Button>
              <Button
                type="button"
                variant={uploadType === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadType("url")}
                data-testid="button-upload-type-url"
              >
                URL
              </Button>
            </div>
          </div>
          {uploadType === "file" ? (
            <div className="grid gap-2">
              <Label htmlFor="file">File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="flex-1"
                  data-testid="input-resource-file"
                />
              </div>
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {file.name}
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                data-testid="input-resource-url"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-resource">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title || !category || !description || (!file && !url)}
            data-testid="button-submit-resource"
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
