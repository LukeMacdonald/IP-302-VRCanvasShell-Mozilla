import { useEffect, useState } from 'react';
import { getCourseFiles, getModuleFiles } from '../database/api';
import { useNavigate } from 'react-router-dom';

const useFetchFiles = (courseID, moduleID) => {
  const [moduleFiles, setModuleFiles] = useState([]);
  
  const [courseFiles, setCourseFiles] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const courseFiles = await getCourseFiles(courseID);
        const moduleFiles = await getModuleFiles(courseID, moduleID);
        
        if (moduleFiles !== undefined) {
          setModuleFiles(moduleFiles);
        }
        if (courseFiles !== undefined) {
          setCourseFiles(courseFiles);
        }
      } catch (error) {
        console.error("Error fetching course files:", error);
        navigate("/error");
      }
    };

    fetchFiles();
  }, [navigate, courseID, moduleID]);

  return { moduleFiles, courseFiles };
};

export default useFetchFiles;