const fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs").promises;
const FormData = require("form-data");
const { restore, backup } = require("./database-controller");

const {
  CANVAS_BASE_URL,
  allowedExtensions,
  enrollementTypes,
} = require("../config/config");

async function get(token, endpoint) {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: token,
      },
    };

    const response = await fetch(endpoint, requestOptions);

    if (!response.ok || !response.status === 404) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error in get function: ${error.message}`);
  }
}

async function getCourses(enrollmentType, token) {
  try {
    const endpoint = `${CANVAS_BASE_URL}courses?per_page=50`;
    const courses = await get(token, endpoint);

    const filteredCourses = courses.filter((course) => {
      const enrollments = course.enrollments.filter(
        (enrollment) => enrollment.type === enrollmentType,
      );
      return enrollments.length > 0;
    });

    return filteredCourses;
  } catch (error) {
    throw error;
  }
}

const courses = async (enrollmentType, token) => {
  try {
    const endpoint = `${CANVAS_BASE_URL}courses?per_page=50`;
    const response = await axios.get(endpoint, {
      headers: { Authorization: token },
    });

    const courses = response.data;

    const filteredCourses = courses.filter((course) => {
      const enrollments = course.enrollments.filter(
        (enrollment) => enrollment.type === enrollmentType,
      );
      return enrollments.length > 0;
    });

    return filteredCourses;
  } catch (error) {
    throw new Error(`Error fetching Canvas Courses: ${error.message}`);
  }
};

const files = async (courseID, token) => {
  try {
    const endpoint = `${CANVAS_BASE_URL}courses/${courseID}/files`;
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching canvas files: ${error.message}`);
  }
};
// Common function to handle errors and send responses
const handleResponse = (res, promise) => {
  promise
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ error: error.message }));
};

exports.teacherCourses = (req, res) => {
  handleResponse(
    res,
    getCourses(enrollementTypes.Staff, req.headers["authorization"]),
  );
};

exports.studentCourses = (req, res) => {
  handleResponse(
    res,
    getCourses(enrollementTypes.Student, req.headers["authorization"]),
  );
};

exports.modules = (req, res) => {
  const { courseID } = req.params;
  const endpoint = `${CANVAS_BASE_URL}courses/${courseID}/modules`;
  handleResponse(res, get(req.headers["authorization"], endpoint));
};

exports.moduleFiles = async (req, res) => {
  try {
    const { courseID, moduleID } = req.params;
    const endpoint = `${CANVAS_BASE_URL}courses/${courseID}/modules/${moduleID}/items`;

    const allModuleItems = await get(req.headers["authorization"], endpoint);

    const files = [];

    await Promise.all(
      allModuleItems.map(async (item) => {
        const url = item.url;
        if (url !== undefined) {
          try {
            const responseData = await get(req.headers["authorization"], url);
            files.push(responseData);
          } catch (error) {
            // Handle errors if needed
            console.error(`Error fetching data for ${url}:`, error);
          }
        }
      }),
    );

    const filteredFiles = files.filter((file) => {
      const fileExtension = file.filename.split(".").pop().toLowerCase();
      return allowedExtensions.includes("." + fileExtension);
    });

    res.status(200).json(filteredFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.profile = (req, res) => {
  const endpoint = CANVAS_BASE_URL + "users/self/profile";
  handleResponse(res, get(req.headers["authorization"], endpoint));
};

exports.createModuleItem = async (req, res) => {
  const { courseID, moduleID, roomURL, roomName } = req.body;
  const endpoint = `${CANVAS_BASE_URL}courses/${courseID}/modules/${moduleID}/items`;
  const data = {
    "module_item[title]": `Hubs: ${roomName}`,
    "module_item[type]": "ExternalUrl",
    "module_item[external_url]": roomURL,
    "module_item[new_tab]": true,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: req.headers["authorization"],
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    });

    const responseData = await response.json();
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.courseFiles = async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const endpoint = `${CANVAS_BASE_URL}courses/${courseID}/files`;
    const data = await get(req.headers["authorization"], endpoint);

    const filteredFiles = data.filter((file) => {
      const fileExtension = file.filename.split(".").pop().toLowerCase();
      return allowedExtensions.includes("." + fileExtension);
    });

    res.status(200).json(filteredFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const course_id = req.params.courseID;
    const data = await backup(course_id);

    console.log(JSON.stringify(data));
    const jsonData = JSON.stringify(data, null, 2);

    const filePath = await backupName(course_id, req.headers["authorization"]);

    await fs.writeFile(filePath, jsonData);
    const initialFormData = new FormData();
    initialFormData.append("name", filePath);
    initialFormData.append("size", Buffer.from(jsonData).length);
    initialFormData.append("content_type", "application/json");
    initialFormData.append("parent_folder_path", "hubs");

    const initialRequestOptions = {
      method: "POST",
      headers: {
        Authorization: req.headers["authorization"],
      },
      body: initialFormData,
    };

    const initialEndpoint = `${CANVAS_BASE_URL}courses/${course_id}/files`;
    const initialResponse = await fetch(initialEndpoint, initialRequestOptions);
    const initialResult = await initialResponse.json();
    const fileData = new FormData();
    const fileBlob = await fs.readFile(filePath);

    console.log("Hello");
    fileData.append("file", fileBlob, {
      filename: filePath,
      contentType: "application/json",
    });

    const finalRequestOptions = {
      method: "POST",
      body: fileData,
    };

    const finalResponse = await fetch(
      initialResult.upload_url,
      finalRequestOptions,
    );
    const finalResult = await finalResponse.json();

    await fs.unlink(filePath);

    res.status(200).json({
      message: "Backup saved and uploaded successfully.",
      result: finalResult,
    });
  } catch (error) {
    console.error("Error saving and uploading backup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.quizzes = async (req, res) => {
  try {
    const { courseID } = req.params;
    const endpoint = `${CANVAS_BASE_URL}courses/${courseID}/quizzes`;
    const allQuizzes = await get(req.headers["authorization"], endpoint);
    const quizzes = allQuizzes.filter((quiz) => quiz.published === true);
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateQuiz = async (req, res) => {
  try {
    const { quizID, quiz, courseID } = req.body;

    const headers = {
      Authorization: req.headers["authorization"],
      "Content-Type": "application/json",
    };

    const endpoint = `${CANVAS_BASE_URL}courses/${courseID}/quizzes/${quizID}`;

    const quizData = await axios.get(endpoint, { headers });

    quizData.data.description = quiz.description;

    // Only send the modified quiz data, not the entire quizData object
    const response = await axios.put(endpoint, quizData.data, { headers });

    console.log("Update response:", response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error updating quiz:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.restore = async (req, res) => {
  try {
    const { courseID, backup } = req.body;
    const response = await axios.get(backup.url);

    const file = response.data;

    await restore(file, courseID);

    res.status(200).json({ message: "Restore Successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error Restoring Data from Canvas: ${error.message}` });
  }
};
exports.backups = async (req, res) => {
  try {
    const { courseID } = req.params;
    const backups = await backupFiles(courseID, req.headers["authorization"]);
    console.log(backups);
    res.status(200).json({ data: backups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const backupFiles = async (courseID, token) => {
  // Canvas Rest API Endpoint to fetch course folders
  let endpoint = `${CANVAS_BASE_URL}courses/${courseID}/folders`;
  const headers = { Authorization: token };

  try {
    let response = await axios.get(endpoint, { headers: headers });
    const folders = response.data;
    // Filter out all folders that aren't the hubs backup folder
    const hubs = folders.filter((folder) => folder.name === "hubs");

    if (hubs.length > 0) {
      endpoint = `${CANVAS_BASE_URL}folders/${hubs[0].id}/files?per_page=50`;
      response = await axios.get(endpoint, { headers: headers });
      return response.data;
    }
    return [];
  } catch (error) {
    throw new Error(`Error Retrieving Backups: ${error.message}`);
  }
};
const backupName = async (courseID, token) => {
  try {
    const backups = await backupFiles(courseID, token);
    const name = `backup-v${backups.length + 1}.json`;
    return name;
  } catch {
    throw new Error("Error Retrieving Backups");
  }
};
