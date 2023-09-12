import { get, post } from "./utils";
const DATA_KEY = "course_data";

const FILES_KEY = "files";

const COURSE_KEY = "course";

const objectPositions = ["0 2 0", "0 2 -2", "0 2 -4", "0 2 -8"]

const domain = "http://131.170.250.239:3000"

async function getCourseDataFromJson(endpoint){
  try{
    const data = await get(endpoint);
    return data;
  }
  catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function setCourse(courseID) {
    try {
      const endpoint = `${domain}/data/${courseID}`;
      const courseData = await getCourseDataFromJson(endpoint);
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

async function deleteRoom(moduleName, roomName){
  try {
    const courseID = getCourseID();
    const endpoint = `${domain}/room/${courseID}/${moduleName}/${roomName}`;
    console.log(endpoint);
    // const response = await fetch(endpoint, {
    //   method: "DELETE",
    // });

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
async function getCourseName(){
  try{
    const courseID = getCourseID();
    const endpoint = `${domain}/course/${courseID}`;
    const course = await get(endpoint) 
    return course.name;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getCourses() {
    try {
      const endpoint = `${domain}/course/teacher`;
      const courses = await get(endpoint);
      return courses;
    } catch (error) {
      console.error("Error:", error);
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
      const endpoint = `${domain}/files/${courseID}` 
      const data = await get(endpoint);
      // Store fetched data in localStorage
      localStorage.setItem(FILES_KEY, JSON.stringify(data));
    } 
    catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

async function addRoomtoModuleFunction(roomData) {
    try {
      const endpoint = `${domain}/room/create`;
      const data = await post(endpoint,roomData);
      return data;
    } catch (error) {
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
  
      const response = await addRoomtoModuleFunction(roomData);
  
      const storedData = {
        RoomID: response.id,
        Objects: objects,
      };
  
      const data = getLocalCourseData();
      data.modules[module].rooms[roomName] = storedData;
  
      // Save and set local data
      saveData(data);
      setLocalData(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
      // Handle the error
    }
  }

async function saveData(data) {
    try {
      const endpoint = `${domain}/course/save`;
      const courseID = getCourseID();
      const request = {
        data,
        courseID,
      };
      const responseData = await post(endpoint,request)
      return responseData;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  
async function loadRoom(module, roomID) {
    try {
      const courseID = getCourseID();
      const endpoint = `${domain}/reload-room`;
  
      const request = {
        moduleName: module,
        courseID: courseID,
        roomID: roomID,
      };
  
      const responseData = await post(endpoint,request)
     
      // Open the URL in a new tab/window
      window.open(responseData.url, "_blank");
  
      return responseData;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

async function getCanvasCourseModules(modules) {
    try {
      const courseID = getCourseID();
      
      const endpoint = `${domain}/modules/${courseID}`;
      
      const canvasModules = await get(endpoint);
      
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
      const endpoint = `${domain}/modules/files/${courseID}/${moduleID}`;
      const canvasFiles = await get(endpoint);
      return canvasFiles;
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
  
      const endpoint = `${domain}/module/create`;
  
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      };
  
      const responseData = await post(endpoint, requestOptions)
      
      // You may want to handle the following actions outside this function
      await setCourse(courseID);
      localStorage.setItem(FILES_KEY, JSON.stringify(responseData));
  
      return responseData;
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
    getCourseName,
    setCourse,
    loadRoom,
    deleteRoom,
    getCourses,
    getCanvasCourseModules,
    createCourseModule,
    getCanvasCourseModuleFiles,
    getLocalCourseData
}