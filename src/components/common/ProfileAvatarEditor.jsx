import React from "react";
import { CameraIcon } from "@heroicons/react/24/solid";
import { cn } from "../../utils/cn";

const ProfileAvatarEditor = ({
  src,
  onUpdate,
  onRemove,
  disabled = false,
  className = "",
}) => {
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUpdate) {
      onUpdate(file);
    }
  };

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <div className="relative group">
        <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm ring-1 ring-gray-200">
          {src ? (
            <img
              src={src}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              <span className="text-2xl font-bold">AJ</span>
            </div>
          )}
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full border-2 border-white text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none"
        >
          <CameraIcon className="h-4 w-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-semibold text-gray-900">Profile Picture</h4>
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          JPG, GIF or PNG. Max size of 800K
        </p>
        <div className="flex items-center gap-4 mt-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Update
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onRemove}
            className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatarEditor;
