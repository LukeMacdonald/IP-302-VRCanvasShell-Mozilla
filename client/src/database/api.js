import { get, post } from "./utils";

const DOMAIN = process.env.REACT_APP_API_URL

const objectPositions = ["0 2 0", "0 2 -2", "0 2 -4", "0 2 -8"]

// Get Requests 
async function getCourseDataFromJson(courseID){
    try{
        const endpoint = `${DOMAIN}/data/course/details/${courseID}`;
        const data = await get(endpoint);
        return data;
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getProfile(){
    try {
      
        const endpoint = `${DOMAIN}/canvas/profile`;
      
        const profile = await get(endpoint);
      
        return profile;
    } 
    catch (error) {
      
        console.error("Error:", error);
      
        throw error;
    }

}
async function getCourses() {
    try {
      
        const endpoint = `${DOMAIN}/canvas/course/teacher`;
      
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
        const endpoint = `${DOMAIN}/canvas/files/${courseID}`
        console.log("Hello");
        const files = await get(endpoint);
        
        console.log(files);
        return files;
    }
    catch (error) { 
        console.error("Error:", error);
        throw error;
    } 
}

async function getCanvasModules(courseID){
    try{
        const endpoint = `${DOMAIN}/canvas/modules/${courseID}/`;
        const modules = await get(endpoint);
        return modules;
    }
    catch (error) { 
        console.error("Error:", error);
        throw error;
    }   
}

async function getUnusedModules(courseID){
    try{
        const canvasModules = await getCanvasModules(courseID);
        console.log(canvasModules);
        const usedModules = await getModules(courseID);
        console.log(usedModules);
        const moduleIds = new Set(Object.keys(usedModules).map(Number));
        const unusedModules = canvasModules.filter((module) => !moduleIds.has(module.id));
        return unusedModules;
    }
    catch (error) { 
        console.error("Error:", error);
        throw error;
    } 
    
}

async function getCanvasFiles(courseID, moduleID){
    try{
        const endpoint = `${DOMAIN}/canvas/modules/files/${courseID}/${moduleID}`;
        const files = await get(endpoint);
        return files;
    }
    catch (error) { 
        console.error("Error:", error);
        throw error;
    }
}

async function getModules(courseID){
    try{
        const endpoint = `${DOMAIN}/data/modules/${courseID}/`;
        const modules = await get(endpoint);
        return modules;
    }
    catch (error) { 
        console.error("Error:", error);
        throw error;
    }   
}

async function getModule(courseID,moduleID){
    try{
        const endpoint = `${DOMAIN}/data/module/${courseID}/${moduleID}`;
        const module = await get(endpoint);
        return module;
    }
    catch (error) { 
        console.error("Error:", error);
        throw error;
    }   
}

async function getModuleFiles(courseID,moduleID){
    try{
        const endpoint = `${DOMAIN}/canvas/module/files/${courseID}/${moduleID}`;
        const files = await get(endpoint);
        return files;
    }
    catch (error) { 
        console.error("Error:", error);
        throw error;
    }   
}

async function getRoom(courseID,moduleID,roomID){
    try{
        const endpoint = `${DOMAIN}/data/room/${courseID}/${moduleID}/${roomID}`;
        const room = await get(endpoint);
        return room;
    }
    catch (error) { 
        console.error("Error:", error);
        throw error;
    }   
}

// Post Requests 
async function postRoom(courseID, moduleID, roomName, roomObjects) {
    try {
        const objects = roomObjects
        .filter((object) => object.url !== "")
        .map((object, index) => ({
          name: object.display_name,
          url: object.url,
          position: object.coordinates,
        }));

        const roomData = {
            roomName,
            objects,
          };

        const endpoint = `${DOMAIN}/hubs/room/create`;

        const body = { courseID: courseID, moduleID: moduleID,data: roomData}

        const data = await post(endpoint,body);
        
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function postCourseData(data, courseID) {
    try {
        const endpoint = `${DOMAIN}/data/course/save`;
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
        const endpoint = `${DOMAIN}/data/module/create`;
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
      const endpoint = `${DOMAIN}/hubs/reload-room`;
  
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

async function signIn(id, password){
    try{
        const endpoint = `${DOMAIN}/data/account/auth/${id}/${password}`;
        const response = await get(endpoint);
        return response.token;
    }
    catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function linkAccount(id, password, token){
    try{
        const params = {id:id, password:password, token:token}
        const endpoint = `${DOMAIN}/data/account/link`;
        const response = await post(endpoint, params);
        return response;
    }
    catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
export{
    getProfile,
    getCourseDataFromJson,
    getCourses,
    getCourseFiles,
    getCanvasModules,
    getUnusedModules,
    getCanvasFiles,
    getModuleFiles,
    getModules,
    getModule,
    getRoom,
    postRoom,
    postCourseData,
    postModule,
    loadRoom,
    deleteRoom,
    signIn,
    linkAccount
}