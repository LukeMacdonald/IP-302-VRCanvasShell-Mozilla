const DATA_KEY = "course_data";

const FILES_KEY = "files";

const COURSE_KEY = "course";

const objectPositions = ["0 2 0", "0 2 -2", "0 2 -4", "0 2 -8"]


async function setCourse(courseID){

    const response = await fetch(`http://localhost:3001/data/${courseID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json()
    localStorage.setItem(DATA_KEY,  JSON.stringify(data))
}

// Initialise local storage "movies" with data, if the data is already set this function returns immediately.
function setFiles() {
    // Stop if data is already initialised.
    if(localStorage.getItem(FILES_KEY) !== null)
      return;

    const files = []
    localStorage.setItem(FILES_KEY, JSON.stringify(files))
    
}

function setLocalData(data){
    localStorage.setItem(DATA_KEY,JSON.stringify(data))
}

function getData(){
    return JSON.parse(localStorage.getItem(DATA_KEY));
}

function getModules(courseID){
    setCourse(courseID);
    const data = getData();
    const modules = data["modules"];
    const isEmpty = Object.keys(modules).length === 0; 
    if (isEmpty){
        return {};
    }
    else{
        return data["modules"];
    }
}

function getModule(moduleName){
    const data = getData()
    const module = data["modules"][moduleName]
    const isEmpty = Object.keys(module).length === 0;
    if (isEmpty){
        return {};
    }
    else{
        return module;
    }
    
}

function getRoom(moduleName,roomName){
    const data = getData()
    return data["modules"][moduleName]["rooms"][roomName]
}

function getCourseID(){
    return JSON.parse(localStorage.getItem(COURSE_KEY));
}

async function setCourseFiles(courseID){

    await setCourse(courseID)
    
    localStorage.setItem(COURSE_KEY,JSON.stringify(courseID))
    
    const response = await fetch(`http://localhost:3001/files/${courseID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json()
    localStorage.setItem(FILES_KEY,  JSON.stringify(data))
}

async function getCourses(){
    const endpoint = "http://localhost:3001/course/teacher";
    try{
        const response = await fetch(endpoint);
        const courses = await response.json();
        return courses;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

function getCoursefiles(){
    const files = localStorage.getItem(FILES_KEY);
    return JSON.parse(files)
}

async function addRoomtoModuleFunction(roomData) {
    const endpoint = "http://localhost:3001/room/create";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
    };

    try {
        const response = await fetch(endpoint, requestOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function addRoomtoModule(module, roomName, roomObjects) {
    try {
        const objects = [];
        roomObjects.forEach((object, index) => {
            if (object.url !== "") {

                const data = {
                    "name": object.display_name,
                    "url": object.url,
                    "position": objectPositions[index]
                };
                objects.push(data);
            }
        });
        const roomData = {
            "roomName": roomName,
            "objects": objects
        };

        const response = await addRoomtoModuleFunction(roomData);

        const storedData = {
            "RoomID": response.id,
            "Objects": objects
        }

        const data = getData()
        data["modules"][module]["rooms"][roomName] = storedData
        saveData(data)
        setLocalData(data)
        
    } catch (error) {
        // Handle the error
    }
}

async function saveData(data) {
    const endpoint = "http://localhost:3001/course/save";
    const courseID = getCourseID();
    const request = { "data": data, "courseID": courseID };

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    };

    try {
        const response = await fetch(endpoint, requestOptions);
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function loadRoom(module,roomID){

    const endpoint = "http://localhost:3001/reload-room"

    const courseID = getCourseID();

    const request = { "moduleName": module, "courseID": courseID, "roomID":roomID };
    
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    };

    try {
        const response = await fetch(endpoint, requestOptions);
        const responseData = await response.json();
        window.open(responseData.url, '_blank');
        return responseData;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function getCanvasCourseModules(modules){
    const courseID = getCourseID();
    const endpoint = `http://localhost:3001/modules/${courseID}`;
    try{
        const response = await fetch(endpoint);
        const canvasModules = await response.json();
        const availableModules = []
        canvasModules.forEach((module) => {
            if (!Object.keys(modules).includes(module.name)) {
                // module.name is not in the modules object
                availableModules.push(module);
            }
        });
        return availableModules;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function getCanvasCourseModuleFiles(moduleID){

    const courseID = getCourseID();
    const endpoint = `http://localhost:3001/modules/files/${courseID}/${moduleID}`;
    try{
        const response = await fetch(endpoint);
        const canvasFiles = await response.json();
        return canvasFiles;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function createCourseModule(moduleID, moduleName){
    const courseID = getCourseID();
    
    const request = { "moduleID":moduleID,"moduleName":moduleName, "courseID": courseID };
    
    const endpoint = "http://localhost:3001/module/create";
    
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    };

    try {
        const response = await fetch(endpoint, requestOptions);
        const responseData = await response.json();
        localStorage.setItem(FILES_KEY,  JSON.stringify(responseData));
        return responseData;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export {
    setCourseFiles, 
    setFiles,
    getCoursefiles,
    addRoomtoModule,
    getModules,
    getModule,
    getRoom,
    getCourseID,
    setCourse,
    loadRoom,
    getCourses,
    getCanvasCourseModules,
    createCourseModule,
    getCanvasCourseModuleFiles
}