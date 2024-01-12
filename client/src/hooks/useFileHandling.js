import { useState } from "react";

const useFileHandling = (initialFiles = []) => {
    
  const [files, setFiles] = useState(initialFiles);
     
  const updateFiles = (file) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  };
  
  const updateFile = (index, updatedFile) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = updatedFile;
      return newFiles;
    });
  };
  
  return { files, updateFiles, updateFile };
};

export default useFileHandling;