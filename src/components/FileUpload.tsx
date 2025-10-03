
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, Check } from "lucide-react";

interface FileUploadProps {
  label: string;
  accept: string;
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
}

export const FileUpload = ({ label, accept, onFileUpload, uploadedFile }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? "border-primary bg-primary/5" 
            : uploadedFile 
            ? "border-green-500 bg-green-50 dark:bg-green-950/20" 
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-6 text-center">
          {uploadedFile ? (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Check className="h-5 w-5" />
              <File className="h-5 w-5" />
              <span className="text-sm font-medium">{uploadedFile.name}</span>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your file here, or
                </p>
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      accept={accept}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: {accept}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
