import { useState, useRef } from "react";
import useUserStore from "../store/user.store";
import profile from "../assets/profile.png";

export const useUserAvatar = () => {
  const { user, isLoading, updateProfilePicture } = useUserStore();
  const [imagePreview, setImagePreview] = useState(
    user?.profilePicture || profile
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await updateProfilePicture(selectedFile);
    setSelectedFile(null); // Re-fetch the updated profile picture from the store
    const updatedUser = useUserStore.getState().user;
    if (updatedUser?.profilePicture) {
      setImagePreview(updatedUser.profilePicture);
    }
  };

  return {
    user,
    isLoading,
    imagePreview,
    selectedFile,
    fileInputRef,
    handleEdit,
    handleFileChange,
    handleUpload,
  };
};
