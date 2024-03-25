import { get, post } from "./utils";
import axios from "axios";
const DOMAIN = process.env.REACT_APP_API_URL;

const token = localStorage.getItem("token");

// Get Requests

async function getProfile() {
  try {
    const endpoint = `${DOMAIN}/canvas/profile`;

    const profile = await get(endpoint);

    return profile;
  } catch (error) {
    console.error("Error:", error);

    throw error;
  }
}

async function getBackup(course_id) {
  try {
    const endpoint = `${DOMAIN}/canvas/upload/${course_id}`;

    const response = await get(endpoint);
    console.log(response);

    return response;
  } catch (error) {
    console.error("Error:", error);

    throw error;
  }
}

async function getCourses() {
  try {
    const endpoint = `${DOMAIN}/canvas/course/teacher`;

    const courses = await get(endpoint);

    return courses;
  } catch (error) {
    console.error("Error:", error);

    throw error;
  }
}

async function getCourseFiles(courseID) {
  try {
    const endpoint = `${DOMAIN}/canvas/files/${courseID}`;
    const files = await get(endpoint);
    return files;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getCanvasModules(courseID) {
  try {
    const endpoint = `${DOMAIN}/canvas/modules/${courseID}`;
    const modules = await get(endpoint);
    return modules;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getUnusedModules(courseID) {
  try {
    const canvasModules = await getCanvasModules(courseID);
    const usedModules = await getModules(courseID);
    console.log(usedModules);
    const moduleIds = new Set(usedModules.map((module) => module.moduleId));
    const unusedModules = canvasModules.filter(
      (module) => !moduleIds.has(module.id),
    );
    console.log(moduleIds);
    return unusedModules;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getCanvasFiles(courseID, moduleID) {
  try {
    const endpoint = `${DOMAIN}/canvas/modules/files/${courseID}/${moduleID}`;
    const files = await get(endpoint);
    return files;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getModules(courseID) {
  try {
    const endpoint = `${DOMAIN}/data/modules/${courseID}/`;
    const modules = await get(endpoint);
    return modules;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getModule(courseID, moduleID) {
  try {
    const endpoint = `${DOMAIN}/data/module/${courseID}/${moduleID}`;
    const module = await get(endpoint);
    return module;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getModuleFiles(courseID, moduleID) {
  try {
    const endpoint = `${DOMAIN}/canvas/module/files/${courseID}/${moduleID}`;
    console.log(endpoint);
    const files = await get(endpoint);

    return files;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getRoom(courseID, moduleID, roomID) {
  try {
    const endpoint = `${DOMAIN}/data/room/${courseID}/${moduleID}/${roomID}`;
    const room = await get(endpoint);
    return room;
  } catch (error) {
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
        position: `${object.position.x} ${object.position.y} ${object.position.z}`,
        scale: `${object.scale.x} ${object.scale.y} ${object.scale.z}`,
        rotation: `${object.rotation.x} ${object.rotation.y} ${object.rotation.z}`,
      }));

    const roomData = {
      roomName,
      objects,
    };

    const endpoint = `${DOMAIN}/hubs/room/create`;

    let body = { courseID: courseID, moduleID: moduleID, data: roomData };

    const data = await post(endpoint, body);

    body["roomURL"] = data.url;
    body["roomName"] = roomName;

    await createModuleEntry(body);

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function createModuleEntry(data) {
  const endpoint = `${DOMAIN}/canvas/module/add`;
  const response = await post(endpoint, data);
  return response;
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
        rotation: object.rotations,
      }));

    const roomData = {
      roomName,
      objects,
    };

    const endpoint = `${DOMAIN}/hubs/room/edit`;

    const body = {
      courseID: courseID,
      moduleID: moduleID,
      roomID,
      data: roomData,
    };

    const data = await post(endpoint, body);

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function postModule(params) {
  try {
    const endpoint = `${DOMAIN}/data/module/create`;
    const response = await post(endpoint, params);
    return response;
  } catch (error) {
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

    const responseData = await post(endpoint, request);

    // Open the URL in a new tab/window
    window.open(responseData.url, "_blank");

    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function updateRoom(roomID) {
  try {
    const endpoint = `${DOMAIN}/hubs/room/update/${roomID}`;
    const response = await get(endpoint);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function signIn(id, password) {
  try {
    const endpoint = `${DOMAIN}/auth/login`;
    const body = {
      username: id,
      password: password,
    };

    const response = await axios.post(endpoint, body);

    const data = response.data;

    return data.token;
  } catch (error) {
    const errMessage = error.response.data.message
      ? error.response.data.message
      : "Invalid Request";
    console.error("Error:", error.message);
    throw new Error(errMessage); // Re-throw the error for the calling code to handle
  }
}
async function updateToken(username, token) {
  try {
    const data = { username, token };

    const endpoint = `${DOMAIN}/auth/key`;

    const response = await axios.put(endpoint, data);

    return response.data;
  } catch (error) {
    const errMessage = error.response.data.message
      ? error.response.data.message
      : error.message;
    console.error("Error:", errMessage);
    throw new Error(errMessage);
  }
}
async function linkAccount(id, password, token) {
  try {
    const params = { username: id, password: password, token: token };

    const endpoint = `${DOMAIN}/auth/register`;

    const response = await axios.post(endpoint, params);

    return response.data;
  } catch (error) {
    const errMessage = error.response.data.message
      ? error.response.data.message
      : "Invalid Request";
    console.error("Error:", error.message);

    throw new Error(errMessage);
  }
}

async function getQuizzes(courseID) {
  try {
    const endpoint = `${DOMAIN}/canvas/quizzes/${courseID}/`;
    const quizzes = await get(endpoint);
    return quizzes;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function updateQuiz(quiz, courseID) {
  try {
    console.log(courseID);
    const data = {
      quizID: quiz.id,
      quiz: { title: quiz.title, description: quiz.description },
      courseID: courseID,
    };
    const endpoint = `${DOMAIN}/canvas/quiz`;
    const response = await post(endpoint, data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function spawnQuiz(token, quizID, courseID) {
  try {
    const data = { token };
    const endpoint = `${DOMAIN}/quiz/spawn/${courseID}/${quizID}`;
    return await post(endpoint, data);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function deleteRoom(roomID) {
  const endpoint = `${DOMAIN}/data/room/${roomID}`;
  await axios.delete(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
async function deleteModule(moduleID) {
  const endpoint = `${DOMAIN}/data/module/${moduleID}`;
  await axios.delete(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

async function getBackups(courseID) {
  const endpoint = `${DOMAIN}/canvas/backups/${courseID}`;
  const response = await axios.get(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
async function restoreBackup(data) {
  console.log(data);
  const endpoint = `${DOMAIN}/canvas/restore`;
  const response = await axios.post(endpoint, data, {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
  console.log(response.data);

  return data;
}
export {
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
  updateRoom,
  signIn,
  updateToken,
  linkAccount,
  getQuizzes,
  updateQuiz,
  spawnQuiz,
  deleteModule,
  deleteRoom,
  getBackups,
  restoreBackup,
};
