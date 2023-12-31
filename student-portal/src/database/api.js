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
async function getCourses() {
    try {
      
        const endpoint = `${DOMAIN}/canvas/course/student`;
      
        const courses = await get(endpoint);
      
        return courses;
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
        console.log(moduleID)
        const endpoint = `${DOMAIN}/data/module/${courseID}/${moduleID}`;
        const module = await get(endpoint);
        return module;
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
    getCourses,
    getModules,
    getModule,
    getRoom,
    loadRoom,
    signIn,
    linkAccount
}