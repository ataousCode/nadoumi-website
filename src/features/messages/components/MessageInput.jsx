import React, { useState, useRef } from 'react';
import {
  PaperClipIcon,
  FaceSmileIcon,
  PhotoIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { messageService } from '../../../api/messages';
import { getImageURL } from '../../../api/config';

const EMOJIS = ['😊','😂','❤️','👍','🙌','🔥','✨','🤔','😎','💡','✅','🚀','⭐','👋','🎓','📚'];

const MessageInput = ({ onSend, onTyping, conversationId, role = 'student' }) => {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [uploading, setUploading] = useState(false);

  // We store the preview info separately based on what type of thing was selected
  const [imagePreview, setImagePreview] = useState(null); // { url, name, size, uploadedUrl }
  const [filePreview, setFilePreview] = useState(null);   // { name, size, uploadedUrl }

  const fileRef = useRef(null);
  const imageRef = useRef(null);

  const reset = () => {
    setText('');
    setImagePreview(null);
    setFilePreview(null);
    setShowEmojis(false);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    // Must have text, image, or file
    if (!text.trim() && !imagePreview && !filePreview) return;

    let payload = { content: text.trim(), type: 'text' };

    if (imagePreview) {
      payload = {
        type: 'image',
        content: text.trim() || 'Sent a picture',
        fileInfo: {
          url: imagePreview.uploadedUrl,
          name: imagePreview.name,
          size: imagePreview.size,
        },
      };
    } else if (filePreview) {
      payload = {
        type: 'file',
        content: text.trim() || `Sent a file: ${filePreview.name}`,
        fileInfo: {
          url: filePreview.uploadedUrl,
          name: filePreview.name,
          size: filePreview.size,
        },
      };
    }

    onSend(payload);
    reset();
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate it's really an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (.jpg, .png, .gif, .webp)');
      e.target.value = '';
      return;
    }

    console.log('[UPLOAD DEBUG] Image selected:', file.name, 'Size:', file.size);
    setUploading(true);
    try {
      // Show local preview immediately while uploading
      const localURL = URL.createObjectURL(file);
      setImagePreview({
        localUrl: localURL,
        name: file.name,
        size: formatBytes(file.size),
        uploadedUrl: null, // will be set after upload
      });

      console.log('[UPLOAD DEBUG] Starting upload to conversation:', conversationId);
      const result = await messageService.uploadFile(conversationId, file, role);
      console.log('[UPLOAD DEBUG] Upload result received:', result);
      
      // Our apiRequest unwraps the axios envelope, so 'result' IS the data object
      const uploadedUrl = result?.url || result?.data?.url;
      
      if (!uploadedUrl) {
        console.warn('[UPLOAD DEBUG] No URL found in result object!');
      } else {
        console.log('[UPLOAD DEBUG] Successfully obtained uploaded URL:', uploadedUrl);
      }

      setImagePreview((prev) => ({
        ...prev,
        uploadedUrl,
      }));
    } catch (err) {
      console.error('[UPLOAD DEBUG] Image upload catch block:', err);
      alert('Image upload failed. Please try again.');
      setImagePreview(null);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate it's NOT an image
    if (file.type.startsWith('image/')) {
      alert('Please use the picture button for images. This button is for documents only.');
      e.target.value = '';
      return;
    }

    console.log('[UPLOAD DEBUG] File selected:', file.name, 'Size:', file.size);
    setUploading(true);
    try {
      setFilePreview({
        name: file.name,
        size: formatBytes(file.size),
        uploadedUrl: null,
      });

      console.log('[UPLOAD DEBUG] Starting upload to conversation:', conversationId);
      const result = await messageService.uploadFile(conversationId, file, role);
      console.log('[UPLOAD DEBUG] Upload result received:', result);

      const uploadedUrl = result?.url || result?.data?.url;
      
      if (!uploadedUrl) {
        console.warn('[UPLOAD DEBUG] No URL found in result object!');
      }

      setFilePreview((prev) => ({
        ...prev,
        uploadedUrl,
      }));
    } catch (err) {
      console.error('[UPLOAD DEBUG] File upload catch block:', err);
      alert('File upload failed. Please try again.');
      setFilePreview(null);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const canSend = (text.trim() || (imagePreview?.uploadedUrl) || (filePreview?.uploadedUrl)) && !uploading;

  return (
    <div className="p-6 bg-white border-t border-gray-100">

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4 flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 max-w-xs relative">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
            <img
              src={imagePreview.localUrl}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">{imagePreview.name}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {uploading ? 'Uploading...' : `${imagePreview.size} • Image ready`}
            </p>
          </div>
          <button
            onClick={() => setImagePreview(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* File Preview */}
      {filePreview && (
        <div className="mb-4 flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 max-w-xs relative">
          <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <DocumentTextIcon className="w-7 h-7 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">{filePreview.name}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {uploading ? 'Uploading...' : `${filePreview.size} • Document ready`}
            </p>
          </div>
          <button
            onClick={() => setFilePreview(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojis && (
        <div className="mb-4 p-3 bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-8 gap-1">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => { setText((p) => p + emoji); setShowEmojis(false); }}
              className="w-9 h-9 flex items-center justify-center text-lg hover:bg-blue-50 rounded-xl transition-all"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-3 focus-within:border-blue-300 transition-all"
      >
        {/* Hidden inputs */}
        <input
          type="file"
          ref={fileRef}
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
          className="hidden"
        />
        <input
          type="file"
          ref={imageRef}
          onChange={handleImageSelect}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
        />

        {/* Left buttons */}
        <div className="flex items-center gap-1 pb-0.5">
          <button
            type="button"
            title="Attach document"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || !!imagePreview || !!filePreview}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-40"
          >
            <PaperClipIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            title="Add emoji"
            onClick={() => setShowEmojis((s) => !s)}
            className={`p-2 rounded-xl transition-all ${showEmojis ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
          >
            <FaceSmileIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            title="Attach photo"
            onClick={() => imageRef.current?.click()}
            disabled={uploading || !!imagePreview || !!filePreview}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all disabled:opacity-40"
          >
            <PhotoIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Text input */}
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); onTyping?.(true); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-transparent resize-none border-none outline-none text-sm text-gray-800 placeholder:text-gray-400 py-1 max-h-32 overflow-y-auto"
          style={{ minHeight: '24px' }}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!canSend}
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            canSend
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {uploading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Send
              <PaperAirplaneIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default MessageInput;
