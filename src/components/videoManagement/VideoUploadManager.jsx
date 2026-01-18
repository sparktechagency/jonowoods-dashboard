// File: context/VideoUploadManager.tsx
import { createContext, useContext, useState } from "react";

const UploadContext = createContext(null);

export const VideoUploadProvider = ({ children }) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState(() => () => {});

  const showUploader = (onSuccess = () => {}) => {
    setOnSuccessCallback(() => onSuccess);
    setUploadModalVisible(true);
  };

  const hideUploader = () => {
    setUploadModalVisible(false);
  };

  return (
    <UploadContext.Provider
      value={{
        uploadModalVisible,
        showUploader,
        hideUploader,
        onSuccessCallback,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useVideoUploader = () => {
  const context = useContext(UploadContext);
  if (!context)
    throw new Error("useVideoUploader must be used within VideoUploadProvider");
  return context;
};
