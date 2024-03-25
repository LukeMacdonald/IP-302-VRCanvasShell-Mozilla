const db = require("../config/db");

exports.createModule = async (req, res) => {
  try {
    const { moduleName, courseID, moduleID, courseName } = req.body;

    const foundCourse = await db.courses.findByPk(courseID);
    if (!foundCourse) {
      await db.courses.create({
        courseId: courseID,
        name: courseName,
      });
    }

    const module = await db.modules.create({
      moduleId: moduleID,
      name: moduleName,
      courseId: courseID,
    });

    res.status(201).send(module);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.modules = async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const modules = await db.modules.findAll({
      where: { courseId: courseID },
      include: { model: db.rooms },
    });

    if (!modules) {
      return res.status(404).send({ error: "Course or modules not found" });
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

    const module = await db.modules.findByPk(moduleID);

    if (!module) {
      return res.status(404).send({ error: "Modules not found" });
    }

    const rooms = await db.rooms.findAll({ where: { moduleId: moduleID } });

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
    const room = await db.rooms.findByPk(roomID);
    res.status(200).send(room);
  } catch (error) {
    console.error("Error fetching room", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.backup = async (course_id) => {
  const course = await db.courses.findByPk(course_id, {
    include: {
      model: db.modules,
      include: { model: db.rooms, include: { model: db.objects } },
    },
  });
  return course;
};

const deleteRoomObjects = async (roomID) => {
  await db.objects.destroy({ where: { roomId: roomID } });
};
const roomDelete = async (roomID) => {
  await deleteRoomObjects(roomID);
  await db.rooms.destroy({ where: { roomId: roomID } });
};

exports.deleteRoom = async (req, res) => {
  const roomID = req.params.roomID;
  await roomDelete(roomID);
  res.status(200).json({ message: "room deleted!" });
};

exports.deleteModule = async (req, res) => {
  const moduleID = req.params.moduleID;

  const rooms = await db.rooms.findAll({ where: { moduleId: moduleID } });

  for (const room of rooms) {
    await roomDelete(room.roomId);
  }

  await db.modules.destroy({ where: { moduleId: moduleID } });

  res.status(200).json({ message: "module deleted!" });
};

exports.restore = async (backup, courseID) => {
  try {
    const modules = await db.modules.findAll({ where: { courseId: courseID } });
    for (const module of modules) {
      const rooms = await db.rooms.findAll({
        where: { moduleId: module.moduleId },
      });
      // Delete rooms and their objects sequentially
      for (const room of rooms) {
        await roomDelete(room.roomId);
      }
    }
    for (const element of backup.modules) {
      // Create rooms and their objects sequentially
      for (const room of element.rooms) {
        await db.rooms.create({
          roomId: room.roomId,
          name: room.name,
          moduleId: room.moduleId,
        });
        for (const object of room.objects) {
          await db.objects.create({
            roomId: object.roomId,
            link: object.link,
            position: object.position,
            scale: object.scale,
            rotation: object.rotation,
          });
        }
      }
    }
  } catch (error) {
    throw error;
  }
};
