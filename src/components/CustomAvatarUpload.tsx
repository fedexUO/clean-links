
import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface CustomAvatarUploadProps {
  onImageSelect: (imageUrl: string) => void;
  onClose: () => void;
  currentCustomAvatar?: string;
}

const CustomAvatarUpload: React.FC<CustomAvatarUploadProps> = ({ 
  onImageSelect, 
  onClose, 
  currentCustomAvatar 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentCustomAvatar || '');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSave = () => {
    if (previewUrl) {
      onImageSelect(previewUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">
            CARICA AVATAR
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100/70 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Preview Area */}
          {previewUrl && (
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-slate-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} className="mx-auto mb-3 text-slate-400" />
            <p className="text-sm font-bold text-slate-600 mb-1 uppercase tracking-wider">
              TRASCINA O CLICCA
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              PNG, JPG, GIF fino a 5MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-slate-600 border border-slate-300/60 rounded-2xl hover:bg-slate-50/70 transition-all font-bold uppercase tracking-widest"
            >
              ANNULLA
            </button>
            <button
              onClick={handleSave}
              disabled={!previewUrl}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SALVA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAvatarUpload;
