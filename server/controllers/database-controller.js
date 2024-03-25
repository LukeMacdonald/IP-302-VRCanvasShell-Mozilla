const db = require("../database");
const { CANVAS_BASE_URL } = require("../config/config");

const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "An error occurred" });
};

async function checkProfile(token, id) {
  const endpoint = CANVAS_BASE_URL + "users/self/profile";

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: token,
    },
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    const responseJson = await response.json();

    if ("errors" in responseJson) {
      return {
        status: false,
        message: "Invalid Developer Key",
      };
    } else {
      const lowercaseId = id.toLowerCase();
      const lowercasePrimaryEmail = responseJson.primary_email.toLowerCase();
      const lowercaseLoginId = responseJson.login_id.toLowerCase();

      if (
        lowercaseId !== lowercasePrimaryEmail &&
        lowercaseId !== lowercaseLoginId
      ) {
        return {
          status: false,
          message:
            "Username/Email does not match the account associated with the developer key",
        };
      }

      return {
        status: true,
        message: "Success",
      };
    }
  } catch (error) {
    console.error("Error making request:", error);
    return {
      status: false,
      message: "Error making request. See console for details.",
    };
  }
}

exports.createModule = async (req, res) => {
  try {
    const { moduleName, courseID, moduleID, courseName } = req.body;

    const courseExists = await db.checkIfCouseExists(courseID);

    if (!courseExists) {
      await db.createCourse(courseID, courseName);
    }

    await db.createModule(moduleID, moduleName, courseID);
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.modules = async (req, res) => {
  try {
    const courseID = req.params.courseID;

    const modules = await db.getAllModules(courseID);

    if (modules === undefined) {
      return res.status(404).send({ error: "Course or modules not found" });
    }
    for (const module of modules) {
      module["rooms"] = await db.getAllRoom(module.module_id);
    }
    res.status(200).send(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.module = async (req, res) => {
  try {
    const moduleID = parseInt(req.params.moduleID, 10);

    const module = await db.getModule(moduleID);

    if (module === undefined) {
      return res.status(404).send({ error: "Modules not found" });
    }

    const rooms = await db.getAllRoom(moduleID);

    const data = {
      rooms: rooms,
      name: module.name,
    };

    res.status(200).send(data);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.room = async (req, res) => {
  try {
    const roomID = req.params.roomID;
    const room = await db.getRoom(roomID);
    res.status(200).send(room);
  } catch (error) {
    console.error("Error fetching room", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.linkAccount = async (req, res) => {
  try {
    const userExists = await db.checkIfUserExists(req.body.id);

    if (userExists !== undefined) {
      res.status(400).json({ error: "Account already exists" });
      return;
    }

    const verifyAccount = await checkProfile(
      `Bearer ${req.body.token}`,
      req.body.id,
    );

    if (!verifyAccount.status) {
      res.status(400).json({ error: verifyAccount.message });
      return;
    }

    await db.createUserAccount(req.body.id, req.body.password, req.body.token);

    res.status(200).json({ message: "Account Successfully Linked" });
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.authenticate = async (req, res) => {
  try {
    const userExists = await db.checkIfUserExists(req.params.id);

    if (userExists !== undefined) {
      if (userExists.password === req.params.password) {
        res.status(200).send({ token: userExists.token });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    } else {
      res.status(404).json({ error: "Account not found" });
      return;
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.backup = async (course_id) => {
  const course = await db.getCourse(course_id);
  course["modules"] = await db.getAllModules(course.course_id);
  for (const module of course.modules) {
    module["rooms"] = await db.getAllRoom(module.module_id);
    for (const room of module.rooms) {
      room["objects"] = await db.getAllObjects(room.room_id);
    }
  }
  return course;
};

const roomDelete = async (roomID) => {
  await db.deleteRoomObjects(roomID);
  await db.deleteRoom(roomID);
};

exports.updateKey = async (req, res) => {
  try {
    const { username, token } = req.body;

    const verifyAccount = await checkProfile(`Bearer ${token}`, username);

    if (verifyAccount.status) {
      await db.updateUserKey(username, token);
      res.status(200).json({ token: token });
    } else {
      res.status(400).send({ message: "Invalid API Key" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error Updating Account Key: ${error.message}` });
  }
};

exports.deleteRoom = async (req, res) => {
  const roomID = req.params.roomID;
  await roomDelete(roomID);
  res.status(200).json({ message: "room deleted!" });
};

exports.deleteModule = async (req, res) => {
  const moduleID = req.params.moduleID;

  const rooms = await db.getAllRoom(moduleID);

  for (const room of rooms) {
    await roomDelete(room.room_id);
  }

  await db.deleteModule(moduleID);

  res.status(200).json({ message: "module deleted!" });
};

exports.restore = async (backup, courseID) => {
  try {
    const modules = await db.getAllModules(courseID);
    console.log(modules);
    for (const module of modules) {
      const rooms = await db.getAllRoom(module.module_id);

      // Delete rooms and their objects sequentially
      for (const room of rooms) {
        await roomDelete(room.room_id);
      }
    }
    for (const element of backup.modules) {
      // Create rooms and their objects sequentially
      for (const room of element.rooms) {
        await db.createRoomEntry(room.room_id, room.name, room.module_id);
        for (const object of room.objects) {
          await db.createObjectEntry(object.room_id, object);
        }
      }
    }
  } catch (error) {
    throw error;
  }
};
