'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';

interface UploadedFile {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  category: string;
}

interface FileUploadProps {
  category: 'products' | 'banners' | 'categories' | 'avatars' | 'logos';
  multiple?: boolean;
  maxFiles?: number;
  onUpload?: (files: UploadedFile[]) => void;
  onRemove?: (fileUrl: string) => void;
  initialFiles?: string[]; // Mevcut dosya URL'leri
  className?: string;
  accept?: string;
  disabled?: boolean;
}

export default function FileUpload({
  category,
  multiple = true,
  maxFiles = 5,
  onUpload,
  onRemove,
  initialFiles = [],
  className = '',
  accept = 'image/*',
  disabled = false
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mevcut dosyaları başlat
  const existingFiles = initialFiles.map(url => ({
    fileName: url.split('/').pop() || '',
    fileUrl: url,
    fileSize: 0,
    fileType: 'image/*',
    category
  }));

  const allFiles = [...existingFiles, ...uploadedFiles];

  // Drag & Drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Dosya işleme
  const handleFiles = useCallback(async (files: File[]) => {
    if (disabled) return;

    const remainingSlots = multiple ? maxFiles - allFiles.length : 1;
    const filesToUpload = files.slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      setError(`Maksimum ${maxFiles} dosya yükleyebilirsiniz`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const newUploadedFiles: UploadedFile[] = [];

      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Upload başarısız');
        }

        newUploadedFiles.push(result.data);
      }

      if (!multiple) {
        setUploadedFiles(newUploadedFiles);
      } else {
        setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      }

      onUpload?.(newUploadedFiles);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload başarısız');
    } finally {
      setUploading(false);
    }
  }, [disabled, multiple, maxFiles, allFiles.length, category, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [disabled, handleFiles]);

  // Dosya seçme
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  // Dosya silme
  const handleRemove = async (fileUrl: string) => {
    if (disabled) return;

    try {
      // API'den sil
      await fetch(`/api/upload?fileUrl=${encodeURIComponent(fileUrl)}`, {
        method: 'DELETE',
      });

      // State'den kaldır
      if (initialFiles.includes(fileUrl)) {
        // Mevcut dosya ise callback çağır
        onRemove?.(fileUrl);
      } else {
        // Upload edilen dosya ise state'den kaldır
        setUploadedFiles(prev => prev.filter(f => f.fileUrl !== fileUrl));
      }

    } catch (error) {
      console.error('Delete error:', error);
      setError('Dosya silinirken hata oluştu');
    }
  };

  // Click handler
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600">Yükleniyor...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Dosyalarınızı sürükleyip bırakın veya{' '}
              <span className="text-blue-500 underline">tıklayarak seçin</span>
            </p>
            <p className="text-xs text-gray-500">
              {multiple ? `Maksimum ${maxFiles} dosya` : '1 dosya'} • PNG, JPG, WEBP
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Uploaded Files */}
      {allFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Yüklenen Dosyalar ({allFiles.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allFiles.map((file, index) => (
              <div key={`${file.fileUrl}-${index}`} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={file.fileUrl}
                    alt={file.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file.fileUrl);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </button>

                {/* File Info */}
                <div className="mt-1">
                  <p className="text-xs text-gray-600 truncate" title={file.fileName}>
                    {file.fileName}
                  </p>
                  {file.fileSize > 0 && (
                    <p className="text-xs text-gray-500">
                      {(file.fileSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 