const db = require("../database");

const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "An error occurred" });
};

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
