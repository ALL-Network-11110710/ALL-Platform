'use client';

import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth } from '@/lib/firebase';

interface ProfileImageUploaderProps {
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
}

export default function ProfileImageUploader({ currentImageUrl, onImageUploaded }: ProfileImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to upload an image');
      setUploading(false);
      return;
    }

    // Initialize Firebase Storage
    const storage = getStorage();
    // Create a unique file path: profile-images/{userId}/{timestamp}_{originalName}
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `profile-images/${user.uid}/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percent);
      },
      (err) => {
        console.error('Upload error:', err);
        setError('Upload failed. Please try again.');
        setUploading(false);
      },
      async () => {
        // Upload complete, get download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onImageUploaded(downloadURL);
        setUploading(false);
        setProgress(0);
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative inline-block w-full">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto bg-neutral-100 flex items-center justify-center">
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if URL is broken
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${auth.currentUser?.displayName || 'U'}&background=f97316&color=fff`;
              }}
            />
          ) : (
            <span className="text-4xl font-bold text-orange-300">
              {auth.currentUser?.displayName?.charAt(0) || 'U'}
            </span>
          )}
        </div>
        <label
          htmlFor="profile-upload"
          className="absolute bottom-2 right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm border-2 border-white cursor-pointer hover:bg-orange-600 transition-colors"
        >
          ✎
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploading && (
        <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-orange-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      <p className="text-[10px] text-neutral-400 text-center">
        Click the ✎ icon to upload a new photo (max 5MB)
      </p>
    </div>
  );
}