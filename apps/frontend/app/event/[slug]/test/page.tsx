"use client";
import { useState, useRef } from "react";
import { Paperclip, Send, Bandage, UploadCloudIcon } from "lucide-react";

interface Attachment {
  file: File;
  id: string;
}

export default function EmailBuilder() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleFiles(files);
  };

  const handleFiles = (files: FileList) => {
    const newAttachments = Array.from(files).map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert("Please fill in both subject and body");
      return;
    }

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSending(false);
    setSubject("");
    setBody("");
    setAttachments([]);
    alert("Email sent successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              New Message
            </span>
          </h1>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Recipient Input */}
        <div className="mb-6">
          <input
            type="email"
            placeholder="Recipient email address"
            className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-700 transition-all"
          />
        </div>

        {/* Subject Input */}
        <div className="mb-6">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject line"
            className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-700 font-medium transition-all"
          />
        </div>

        {/* Body Editor */}
        <div className="mb-6">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Compose your message here..."
            className="w-full h-64 px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-700 resize-none transition-all"
          />
        </div>

        {/* Attachment Zone */}
        <div
          className={`mb-8 border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-200 hover:border-blue-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <UploadCloudIcon className="w-12 h-12 text-blue-500 mb-4 opacity-80" />
            <p className="text-gray-500 mb-2">
              Drag & drop files here, or{" "}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                browse your device
              </button>
            </p>
            <p className="text-sm text-gray-400">Max file size: 25MB</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleAttachment}
            className="hidden"
          />
        </div>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-8 space-y-3">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border border-gray-100 hover:bg-gray-100/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Paperclip className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {attachment.file.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {(attachment.file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Bandage className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={isSending}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </div>
          )}
        </button>

        {/* Progress Bar */}
        {isSending && (
          <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-500 animate-pulse origin-left transition-transform duration-2000"></div>
          </div>
        )}
      </div>
    </div>
  );
}
