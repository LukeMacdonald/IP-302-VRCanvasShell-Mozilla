import { get, post } from "./utils";

const DOMAIN = process.env.REACT_APP_API_URL

// Get Requests 

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

async function getBackup(course_id){
    try {
      
        const endpoint = `${DOMAIN}/canvas/upload/${course_id}`;
      
        const response = await get(endpoint);
      
        return response;
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
        const usedModules = await getModules(courseID);
        console.log(usedModules)
        const moduleIds = new Set(usedModules.map(module => module.module_id));
        const unusedModules = canvasModules.filter((module) => !moduleIds.has(module.id));
        console.log(moduleIds)
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
          link: object.url,
          position: `${object.coordinates["x"] } ${object.coordinates["y"]} ${ object.coordinates["z"]}`,
          scale: `${object.scales["x"] } ${object.scales["y"]} ${ object.scales["z"]}`,
          rotation: `${object.rotations["x"] } ${object.rotations["y"]} ${ object.rotations["z"]}`
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

async function editRoom(courseID, moduleID, roomName, roomID, roomObjects) {
    try {
        const objects = roomObjects
        .filter((object) => object.url !== "")
        .map((object, index) => ({
          name: object.display_name,
          link: object.url,
          position: object.coordinates,
          scale: object.scales,
          rotation: object.rotations
        }));

        const roomData = {
            roomName,
            objects,
          };

        const endpoint = `${DOMAIN}/hubs/room/edit`;

        const body = { courseID: courseID, moduleID: moduleID, roomID, data: roomData}

        const data = await post(endpoint,body);
        
        return data;
    } catch (error) {
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

async function signIn(id, password) {
    try {
      const endpoint = `${DOMAIN}/data/account/auth/${id}/${password}`;
      const response = await fetch(endpoint, {
        method: 'GET',
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error);
      }
  
      const data = await response.json();
      return data.token;
    } catch (error) {
        console.error("Error:", error.message);
      throw error; // Re-throw the error for the calling code to handle
    }
}

async function linkAccount(id, password, token){
    try{
        const params = {id:id, password:password, token:token}
        const endpoint = `${DOMAIN}/data/account/link`;

        const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(params),
          };
        const response = await fetch(endpoint, requestOptions);

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error);
        }

        return response;
    }
    catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
export{
    getProfile,
    getBackup,
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
    editRoom,
    postModule,
    loadRoom,
    signIn,
    linkAccount
}