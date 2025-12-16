import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, Image, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File, url?: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const FileUpload = ({ onFileSelect, onClose, isOpen }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // For now, just pass the file to parent - can be extended to upload to storage
      onFileSelect(selectedFile);
      toast.success(`File "${selectedFile.name}" ready to send`);
      resetState();
      onClose();
    } catch (error) {
      toast.error('Failed to process file');
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-8 h-8" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="absolute bottom-full left-0 right-0 mb-2 p-4 rounded-xl bg-card/95 backdrop-blur-xl border border-primary/20 shadow-2xl"
          style={{ boxShadow: '0 0 30px hsl(var(--primary) / 0.2)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Upload File</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="w-6 h-6">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.json"
          />

          {!selectedFile ? (
            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed cursor-pointer transition-all
                ${isDragging 
                  ? 'border-primary bg-primary/10' 
                  : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'
                }
              `}
            >
              <motion.div
                animate={{ y: isDragging ? -5 : 0 }}
                className="flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-primary" />
                <p className="text-sm text-muted-foreground text-center">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Images, PDFs, Documents (Max 10MB)
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {/* File Preview */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-primary/10">
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-12 h-12 rounded object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary">
                    {getFileIcon(selectedFile.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetState}
                  className="w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={resetState}
                  className="flex-1 border-muted-foreground/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Send File'
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
