const fetch = require('node-fetch');
const fs = require('fs').promises;
const FormData = require('form-data');
const { CANVAS_BASE_URL, allowedExtensions, enrollementTypes } = require('../config/config');
const { backup } = require('./database-controller');

async function get(token, endpoint) {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    };

    const response = await fetch(endpoint, requestOptions);

    if (!response.ok) {
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

    const filteredCourses = courses.filter(course => {
      const enrollments = course.enrollments.filter(enrollment => enrollment.type === enrollmentType);
      return enrollments.length > 0;
    });

    return filteredCourses;
  } catch (error) {
    throw error;
  }
}

// Common function to handle errors and send responses
const handleResponse = (res, promise) => {
  promise
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json({ error: error.message }));
};

exports.teacherCourses = (req, res) => {
  handleResponse(res, getCourses(enrollementTypes.Staff, req.headers['authorization']));
};

exports.studentCourses = (req, res) => {
  handleResponse(res, getCourses(enrollementTypes.Student, req.headers['authorization']));
};

exports.modules = (req, res) => {
  const { courseID } = req.params;
  const endpoint = `${CANVAS_BASE_URL}courses/${courseID}/modules`;
  handleResponse(res, get(req.headers['authorization'], endpoint));
};

exports.moduleFiles = async (req, res) => {
  try {
    const { courseID, moduleID } = req.params;
    const endpoint = `${CANVAS_BASE_URL}courses/${courseID}/modules/${moduleID}/items`;
    const allModuleItems = await get(req.headers['authorization'], endpoint);

    const files = await Promise.all(allModuleItems.map(async (item) => {
      const responseData = await get(req.headers['authorization'], item.url);
      return responseData;
    }));

    const filteredFiles = files.filter(file => {
      const fileExtension = file.filename.split('.').pop().toLowerCase();
      return allowedExtensions.includes('.' + fileExtension);
    });

    res.status(200).json(filteredFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.profile = (req, res) => {
  const endpoint = CANVAS_BASE_URL + 'users/self/profile';
  handleResponse(res, get(req.headers['authorization'], endpoint));
};

exports.createModuleItem = async (req, res) => {
  const { courseID, moduleID, roomURL, roomName } = req.body;
  const endpoint = `${CANVAS_BASE_URL}courses/${courseID}/modules/${moduleID}/items`;
  const data = {
    'module_item[title]': `Hubs: ${roomName}`,
    'module_item[type]': 'ExternalUrl',
    'module_item[external_url]': roomURL,
    'module_item[new_tab]': true,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': req.headers['authorization'],
        'Content-Type': 'application/x-www-form-urlencoded',
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
    const data = await get(req.headers['authorization'], endpoint);

    const filteredFiles = data.filter(file => {
      const fileExtension = file.filename.split('.').pop().toLowerCase();
      return allowedExtensions.includes('.' + fileExtension);
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
    const jsonData = JSON.stringify(data, null, 2);
    const filePath = 'backup.json';
    await fs.writeFile(filePath, jsonData);

    const initialFormData = new FormData();
    initialFormData.append('name', 'backup.json');
    initialFormData.append('size', Buffer.from(jsonData).length);
    initialFormData.append('content_type', 'application/json');
    initialFormData.append('parent_folder_path', 'hubs');

    const initialRequestOptions = {
      method: 'POST',
      headers: {
        'Authorization': req.headers['authorization'],
      },
      body: initialFormData,
    };

    const initialEndpoint = `${CANVAS_BASE_URL}courses/${course_id}/files`;
    const initialResponse = await fetch(initialEndpoint, initialRequestOptions);
    const initialResult = await initialResponse.json();

    const fileData = new FormData();
    const fileBlob = await fs.readFile(filePath);

    fileData.append('file', fileBlob, { filename: 'backup.json', contentType: 'application/json' });

    const finalRequestOptions = {
      method: 'POST',
      body: fileData,
    };

    const finalResponse = await fetch(initialResult.upload_url, finalRequestOptions);
    const finalResult = await finalResponse.json();

    await fs.unlink(filePath);

    res.status(200).json({ message: 'Backup saved and uploaded successfully.', result: finalResult });
  } catch (error) {
    console.error('Error saving and uploading backup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.quizzes = async (req, res) => {
  try{
    const { courseID } = req.params;
    const endpoint = `${CANVAS_BASE_URL}courses/${courseID}/quizzes`;
    const allQuizzes = await get(req.headers['authorization'], endpoint);
    const quizzes = allQuizzes.filter(quiz => quiz.published === true);
    res.status(200).json(quizzes);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
  

}