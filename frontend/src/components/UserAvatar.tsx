import { Pencil } from "lucide-react";
import { useUserAvatar } from "../hooks/useUserAvatar";

function UserAvatar() {
  const {
    user,
    isLoading,
    imagePreview,
    selectedFile,
    fileInputRef,
    handleEdit,
    handleFileChange,
    handleUpload,
  } = useUserAvatar();

  return (
    <div className="flex flex-col items-center relative">
      {" "}
      <div className="relative">
        {" "}
        <img
          src={imagePreview}
          alt="Profile"
          className="rounded-full w-36 h-36 object-cover ring-8 ring-emerald-50"
        />
        {/* Edit Button */}{" "}
        <button
          onClick={handleEdit}
          className="absolute bottom-2 right-2 bg-emerald-500 hover:bg-emerald-600 
                     text-white p-2 rounded-full shadow-md transition"
        >
          <Pencil className="w-4 h-4" />{" "}
        </button>{" "}
      </div>{" "}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />{" "}
      <div className="text-xl font-semibold text-gray-800 mt-4">
        {user?.fullname}{" "}
      </div>{" "}
      <div className="text-sm text-gray-600">
        {" "}
        {"@" +
          (user?.fullname as string)?.replace(/\s/g, "").toLowerCase()}{" "}
      </div>{" "}
      {selectedFile && (
        <button
          onClick={handleUpload}
          className={`mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-md hover:from-emerald-600 hover:to-teal-600 transition ${
            isLoading ? "opacity-50" : "opacity-100"
          }`}
        >
          {isLoading ? "Updating profile..." : "Save Changes"}{" "}
        </button>
      )}{" "}
    </div>
  );
}

export default UserAvatar;
