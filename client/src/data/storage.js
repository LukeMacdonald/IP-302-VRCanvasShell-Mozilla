import { getCourseDataFromJson, getCourseFiles, postRoom, postCourseData, getCanvasModules, getCanvasFiles, postModule} from "./api";

const DATA_KEY = "course_data";

const FILES_KEY = "files";

const COURSE_KEY = "course";

const objectPositions = ["0 2 0", "0 2 -2", "0 2 -4", "0 2 -8"]





async function setCourse(courseID) {
  try{
      const courseData = await getCourseDataFromJson(courseID);
      localStorage.setItem(DATA_KEY, JSON.stringify(courseData));
    } 
    catch (error) {
      console.error('Error:', error); 
      throw error;
    }
}

function setLocalData(data) {
  try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } 
  catch (error) {
      console.error('Error setting local data:', error);
      throw error;
  }
}

function getLocalCourseData() {
    try {
      const storedData = localStorage.getItem(DATA_KEY);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error('Error getting data from local storage:', error);
      // Handle the error as needed (e.g., show a user-friendly error message)
      throw error;
    }
}

function getModules(courseID) {
    setCourse(courseID);
    const data = getLocalCourseData();
    return data.modules || {};
}
  
function getModule(moduleName) {
    const data = getLocalCourseData();
    return data.modules ? data.modules[moduleName] || {} : {};
}

function getRoom(moduleName, roomName) {
    try {
      const data = getLocalCourseData();
      if (data && data.modules && data.modules[moduleName] && data.modules[moduleName].rooms) {
        const roomData = data.modules[moduleName].rooms[roomName];
        if (roomData !== undefined) {
          return roomData;
        }
      }
      // Handle the missing data structure or roomName not found
      throw new Error("Room not found");
    } catch (error) {
      console.error("Error:", error);
      // Return a default value or handle the error appropriately
      throw error;
    }
}

function getCourseID() {
    try {
      const courseID = JSON.parse(localStorage.getItem(COURSE_KEY));
      if (courseID !== null) {
        return courseID;
      }
      // Handle the case when courseID is null or undefined
      throw new Error("Course ID not found");
    } catch (error) {
      console.error("Error:", error);
      // Return a default value or handle the error appropriately
      throw error;
    }
}

function getCoursefiles() {
    try {
      const files = localStorage.getItem(FILES_KEY);
      return JSON.parse(files) || null;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
async function setCourseFiles(courseID) {
    try {
      
      // Set the course
      await setCourse(courseID);
      // Store courseID in localStorage
      localStorage.setItem(COURSE_KEY, JSON.stringify(courseID));
     
      const files = await getCourseFiles(courseID);
      
      // Store fetched data in localStorage
      localStorage.setItem(FILES_KEY, JSON.stringify(files));
    } 
    catch (error) {
      console.error("Error:", error);
      throw error;
    }
}



async function addRoomtoModule(module, roomName, roomObjects) {
    try {
      const objects = roomObjects
        .filter((object) => object.url !== "")
        .map((object, index) => ({
          name: object.display_name,
          url: object.url,
          position: objectPositions[index],
        }));
  
      const roomData = {
        roomName,
        objects,
      };
  
      const response = await postRoom(roomData);
  
      const storedData = {
        RoomID: response.id,
        Objects: objects,
      };
  
      const data = getLocalCourseData();
      data.modules[module].rooms[roomName] = storedData;
      const courseID = getCourseID();
  
      // Save and set local data
      postCourseData(data, courseID);
      setLocalData(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
      // Handle the error
    }
}


  


async function getCanvasCourseModules(modules) {
    try {
      const courseID = getCourseID();
      const canvasModules = await getCanvasModules(courseID);
    
      // Use filter and Set for efficient module filtering
      const moduleIds = new Set(Object.keys(modules).map(Number));
      const availableModules = canvasModules.filter((module) => !moduleIds.has(module.id));
  
      return availableModules;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
}

async function getCanvasCourseModuleFiles(moduleID) {
    try {
      const courseID = getCourseID();
      const files = getCanvasFiles(courseID, moduleID);
      return files;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
}

async function createCourseModule(moduleID, moduleName) {
    try {
      
      const courseID = getCourseID();
      
      const request = {
        moduleID,
        moduleName,
        courseID,
      };

      const response = postModule(request)
    
      // You may want to handle the following actions outside this function
      await setCourse(courseID);
      localStorage.setItem(FILES_KEY, JSON.stringify(response));
  
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
}
  
export {
    getCoursefiles,
    setCourseFiles,
    addRoomtoModule,
    getModules,
    getModule,
    getRoom,
    getCourseID,
    setCourse,
    getCanvasCourseModules,
    createCourseModule,
    getCanvasCourseModuleFiles,
    getLocalCourseData
}