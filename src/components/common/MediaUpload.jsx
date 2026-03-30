import React, { useRef, useState } from 'react';
import { CloudArrowUpIcon, PhotoIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { uploadMedia } from '../../api/media';
import { cn } from '../../utils/cn';

const MediaUpload = ({ label, value, onChange, folder = 'nadoumi/assets', containerClassName, className, error }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const response = await uploadMedia(file, folder);
      onChange(response.data.url);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 block">
          {label}
        </label>
      )}

      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer border-2 border-dashed rounded-[32px] transition-all overflow-hidden bg-gray-50/30",
          value ? "border-blue-200" : "border-gray-200 hover:border-blue-400 py-10",
          !value && "aspect-video",
          containerClassName,
          isUploading && "opacity-75 cursor-wait",
          (error || uploadError) && "border-rose-300 bg-rose-50/20"
        )}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />

        {value ? (
          <div className="absolute inset-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
               <button 
                 type="button" 
                 onClick={handleClear}
                 className="p-3 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-colors shadow-xl"
               >
                 <XMarkIcon className="w-6 h-6" />
               </button>
               <span className="text-white text-[10px] font-black uppercase tracking-widest">Change Photo</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className={cn(
              "w-16 h-16 rounded-3xl bg-white shadow-sm border border-gray-100 flex items-center justify-center transition-transform group-hover:scale-110",
              isUploading && "animate-pulse"
            )}>
              {isUploading ? (
                <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
              ) : (
                <CloudArrowUpIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">
                {isUploading ? 'Uploading asset...' : 'Click to upload from computer'}
              </p>
              <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-widest">
                SVG, PNG, JPG or WebP (MAX. 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {(error || uploadError) && (
        <p className="text-xs font-bold text-rose-500 ml-2 animate-shake">
          {error || uploadError}
        </p>
      )}
    </div>
  );
};

export default MediaUpload;
