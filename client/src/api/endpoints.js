import API from "./axios";

// Get Requests
async function getProfile() {
  try {
    const response = await API.get(`canvas/profile`);

    return response.data;
  } catch (error) {
    console.error("Error:", error);

    throw error;
  }
}

async function getBackup(course_id) {
  try {
    const response = API.get(`canvas/upload/${course_id}`);

    return response.data;
  } catch (error) {
    console.error("Error:", error);

    throw error;
  }
}

async function getCourses() {
  try {
    const response = await API.get(`canvas/course/teacher`);

    return response.data;
  } catch (error) {
    console.error("Error:", error);

    throw error;
  }
}

async function getCourseFiles(courseID) {
  try {
    const response = await API.get(`canvas/files/${courseID}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getCanvasModules(courseID) {
  try {
    const response = await API.get(`canvas/modules/${courseID}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getUnusedModules(courseID) {
  try {
    const canvasModules = await getCanvasModules(courseID);
    const usedModules = await getModules(courseID);
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
    const response = await API.get(
      `canvas/modules/files/${courseID}/${moduleID}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getModules(courseID) {
  try {
    const response = await API.get(`data/modules/${courseID}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getModule(courseID, moduleID) {
  try {
    const response = await API.get(`data/module/${courseID}/${moduleID}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getModuleFiles(courseID, moduleID) {
  try {
    const response = await API.get(
      `canvas/module/files/${courseID}/${moduleID}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getRoom(courseID, moduleID, roomID) {
  try {
    const response = await API.get(
      `data/room/${courseID}/${moduleID}/${roomID}`,
    );
    return response.data;
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

    let body = { courseID: courseID, moduleID: moduleID, data: roomData };

    const response = await API.post(`hubs/room/create`, body);
    body["roomURL"] = response.data.url;
    body["roomName"] = roomName;

    await createModuleEntry(body);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function createModuleEntry(data) {
  const response = await API.post(`canvas/module/add`, data);
  return response.data;
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

    const body = {
      courseID: courseID,
      moduleID: moduleID,
      roomID,
      data: roomData,
    };

    const response = await API.post(`hubs/room/edit`, body);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function postModule(params) {
  try {
    const response = await API.post(`data/module/create`, params);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function loadRoom(module, roomID, courseID) {
  try {
    const request = {
      moduleName: module,
      courseID: courseID,
      roomID: roomID,
    };

    const response = await API.post(`hubs/reload-room`, request);

    // Open the URL in a new tab/window
    window.open(response.data.url, "_blank");

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function updateRoom(roomID) {
  try {
    const response = await API.get(`hubs/room/update/${roomID}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function signIn(id, password) {
  try {
    const body = {
      username: id,
      password: password,
    };
    const response = await API.post(`auth/login`, body);

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

    const response = await API.post(`auth/key`, data);

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

    const response = await API.post(`auth/register`, params);

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
    const response = await API.get(`canvas/quizzes/${courseID}`);
    return response.data;
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
    const response = await API.post(`canvas/quiz`, data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function spawnQuiz(token, quizID, courseID) {
  try {
    const data = { token };
    const response = await API.post(`quiz/spawn/${courseID}/${quizID}`, data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function deleteRoom(roomID) {
  await API.delete(`data/room/${roomID}`);
}
async function deleteModule(moduleID) {
  await API.delete(`data/module/${moduleID}`);
}

async function getBackups(courseID) {
  const response = await API.get(`canvas/backups/${courseID}`);
  return response.data;
}
async function restoreBackup(data) {
  const response = await API.get(`canvas/restore`);
  return response.data;
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
