import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Star, Eye } from "lucide-react";
import { useState } from "react";

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  rating: number;
  downloads: number;
  uploadedBy: string;
  onDownload?: () => void;
  onView?: () => void;
}

export function ResourceCard({
  id,
  title,
  description,
  category,
  fileType,
  rating,
  downloads,
  uploadedBy,
  onDownload,
  onView,
}: ResourceCardProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    onDownload?.();
  };

  const getFileIcon = () => {
    return <FileText className="h-8 w-8" />;
  };

  return (
    <Card className="hover-elevate" data-testid={`resource-card-${id}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {getFileIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                {category}
              </span>
              <span className="text-xs text-muted-foreground">{fileType}</span>
            </div>
            <h3 className="font-semibold mt-1 truncate">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {rating.toFixed(1)}
              </span>
              <span>{downloads} downloads</span>
              <span>by {uploadedBy}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onView}
            data-testid={`button-view-${id}`}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant={downloaded ? "secondary" : "default"}
            size="sm"
            className="flex-1"
            onClick={handleDownload}
            data-testid={`button-download-${id}`}
          >
            <Download className="h-4 w-4 mr-1" />
            {downloaded ? "Downloaded" : "Download"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
