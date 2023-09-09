const DATA_KEY = "course_data";

const FILES_KEY = "files";

const COURSE_KEY = "course";

const objectPositions = ["0 2 0", "0 2 -2", "0 2 -4", "0 2 -8"]


async function setCourse(courseID) {
    try {
      const response = await fetch(`http://localhost:3001/data/${courseID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {

        throw new Error(`Failed to fetch data for course ${courseID}`);
      }
      const data = await response.json();
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error:', error);
      // Handle the error as needed (e.g., show a user-friendly error message)
      throw error;
    }
}

  function setLocalData(data) {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting local data:', error);
      // Handle the error as needed (e.g., show a user-friendly error message)
      throw error;
    }
}

  function getData() {
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
    const data = getData();
    return data.modules || {};
}
  
  function getModule(moduleName) {
    const data = getData();
    return data.modules ? data.modules[moduleName] || {} : {};
}

function getRoom(moduleName, roomName) {
    try {
      const data = getData();
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
    const endpoint = `http://localhost:3001/room/${courseID}/${moduleName}/${roomName}`;
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
    const endpoint = `http://localhost:3001/course/${courseID}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const course = await response.json();
    return course.name;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getCourses() {
    try {
      const endpoint = "http://localhost:3001/course/teacher";
      const response = await fetch(endpoint);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const courses = await response.json();
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
  
      // Fetch course files
      const response = await fetch(`http://localhost:3001/files/${courseID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Store fetched data in localStorage
      localStorage.setItem(FILES_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

async function addRoomtoModuleFunction(roomData) {
    try {
      const endpoint = "http://localhost:3001/room/create";
  
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      };
  
      const response = await fetch(endpoint, requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const data = await response.json();
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
  
      const data = getData();
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
      const endpoint = "http://localhost:3001/course/save";
      const courseID = getCourseID();
      const request = {
        data,
        courseID,
      };
  
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      };
  
      const response = await fetch(endpoint, requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  
async function loadRoom(module, roomID) {
    try {
      const courseID = getCourseID();
      const endpoint = "http://localhost:3001/reload-room";
  
      const request = {
        moduleName: module,
        courseID: courseID,
        roomID: roomID,
      };
  
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      };
  
      const response = await fetch(endpoint, requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const responseData = await response.json();
  
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
      const endpoint = `http://localhost:3001/modules/${courseID}`;
      
      const response = await fetch(endpoint);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const canvasModules = await response.json();
  
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
      const endpoint = `http://localhost:3001/modules/files/${courseID}/${moduleID}`;
  
      const response = await fetch(endpoint);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const canvasFiles = await response.json();
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
  
      const endpoint = "http://localhost:3001/module/create";
  
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      };
  
      const response = await fetch(endpoint, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const responseData = await response.json();
      
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
    getCanvasCourseModuleFiles
}