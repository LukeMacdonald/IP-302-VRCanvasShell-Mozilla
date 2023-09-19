import { get, post } from "./utils";

const DOMAIN = "https://client.canvas-hub.com:3000"

// Get Requests 
async function getCourseDataFromJson(courseID){
    try{
        const endpoint = `${DOMAIN}/data/${courseID}`;
        const data = await get(endpoint);
        return data;
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getCourseName(courseID){
    try{
        const endpoint = `${DOMAIN}/course/${courseID}`;
      
        const course = await get(endpoint) 
      
        return course.name;
    } 
    catch (error) {
      
        console.error("Error:", error);
      
        throw error;
    }
}

async function getCourses() {
    try {
      
        const endpoint = `${DOMAIN}/course/teacher`;
      
        const courses = await get(endpoint);
      
        return courses;
    } 
    catch (error) {
      
        console.error("Error:", error);
      
        throw error;
    }
}

async function getCourseFiles(courseID){
    try{
        const endpoint = `${DOMAIN}/files/${courseID}`
        const files = await get(endpoint);
        return files;
    }
    catch (error) { 
        console.error("Error:", error);
        throw error;
    }

    
}
async function getCanvasModules(courseID){
    try{
        const endpoint = `${DOMAIN}/modules/${courseID}/`;
        const modules = await get(endpoint);
        return modules;
    }
    catch (error) { 
        console.error("Error:", error);
        throw error;
    }   
}

async function getCanvasFiles(courseID, moduleID){
    try{
        const endpoint = `${DOMAIN}/modules/files/${courseID}/${moduleID}`;
        const files = await get(endpoint);
        return files;
    }
    catch (error) { 
        console.error("Error:", error);
        throw error;
    }
}

// Post Requests 

async function postRoom(roomData) {
    try {
        const endpoint = `${DOMAIN}/room/create`;
      
        const data = await post(endpoint,roomData);
      
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function postCourseData(data, courseID) {
    try {
        const endpoint = `${DOMAIN}/course/save`;
        const request = {
            data,
            courseID,
        };
        const responseData = await post(endpoint,request)
        return responseData;
    } 
    catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function postModule(params){
    try{
        const endpoint = `${DOMAIN}/module/create`;
        const response = await post(endpoint, params);
        return response;
    }
    catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function loadRoom(module, roomID, courseID) {
    try {
      const endpoint = `${DOMAIN}/reload-room`;
  
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


// Delete Requests
async function deleteRoom(moduleName, roomName){
    try {
        //const endpoint = `${DOMAIN}/room/${courseID}/${moduleName}/${roomName}`;
        //console.log(endpoint);
        // const response = await fetch(endpoint, {
        //   method: "DELETE",
        // });
  
    } 
    catch (error) {
        console.error("Error:", error);
      // Return a default value or handle the error appropriately
        throw error;
    }
  
}





export{
    getCourseDataFromJson,
    getCourseName,
    getCourses,
    getCourseFiles,
    getCanvasModules,
    getCanvasFiles,
    postRoom,
    postCourseData,
    postModule,
    loadRoom,
    deleteRoom
}