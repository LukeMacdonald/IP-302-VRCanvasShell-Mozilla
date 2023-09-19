const fetch = require('node-fetch');
const { CANVAS_BASE_URL, allowedExtensions } = require('../config/config');

// Reusable function to make API requests
async function makeRequest(url, requestOptions) {
  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

exports.teacherCourses = async (req, res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      }
    };
    const endpoint = CANVAS_BASE_URL + 'courses';
    const courses = await makeRequest(endpoint, requestOptions);

    const teacherCourses = courses.filter(course => {
      const teacherEnrollments = course.enrollments.filter(enrollment => enrollment.type === 'teacher');
      return teacherEnrollments.length > 0;
    });
    res.status(200).json(teacherCourses);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.studentCourses = async (req, res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      }
    };
    const endpoint = CANVAS_BASE_URL + 'courses';
    const courses = await makeRequest(endpoint, requestOptions);

    const studentCourses = courses.filter(course => {
      const studentEnrollments = course.enrollments.filter(enrollment => enrollment.type === 'student');
      return studentEnrollments.length > 0;
    });
    res.status(200).json(studentCourses);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.modules = async (req, res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      }
    };
    const courseID = req.params.courseID;
    const endpoint = CANVAS_BASE_URL + `courses/${courseID}/modules`;
    const modules = await makeRequest(endpoint, requestOptions);
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.moduleFiles = async (req, res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      }
    };
    const courseID = req.params.courseID;
    const moduleID = req.params.moduleID;
    const endpoint = CANVAS_BASE_URL + `courses/${courseID}/modules/${moduleID}/items`;
    const items = await makeRequest(endpoint, requestOptions);

    const files = await Promise.all(items.map(async item => {
      const responseData = await makeRequest(item.url, requestOptions);
      return responseData;
    }));

    const filteredFiles = files.filter(file => {
      const fileExtension = file.filename.split('.').pop().toLowerCase();
      return allowedExtensions.includes('.' + fileExtension);
    });

    res.status(200).json(filteredFiles);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.courseFiles = async (req, res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      }
    };
    const courseID = req.params.courseID;
    const endpoint = CANVAS_BASE_URL + `courses/${courseID}/files`;
    const data = await makeRequest(endpoint, requestOptions);

    const filteredFiles = data.filter(file => {
      const fileExtension = file.filename.split('.').pop().toLowerCase();
      return allowedExtensions.includes('.' + fileExtension);
    });

    res.status(200).json(filteredFiles);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
