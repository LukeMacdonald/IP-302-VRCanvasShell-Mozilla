'use strict'

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { CANVAS_BASE_URL } = process.env;

// Middleware to set common request options
function setCommonRequestOptions(req, res, next) {
  req.requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': req.headers['authorization']
    }
  };
  next();
}

// Custom error handling middleware
function errorHandler(error, req, res, next) {
  console.error(error);
  res.status(500).send('An error occurred');
}

// Constants for file extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
const modelExtensions = ['.glb', '.gltf'];
const allowedExtensions = [...imageExtensions, ...modelExtensions, '.pdf', '.mp4'];

// Route for getting teacher courses
router.get('/course/teacher', setCommonRequestOptions, async (req, res, next) => {
  try {
    const { requestOptions } = req;
    const endpoint = CANVAS_BASE_URL + 'courses';
    const response = await fetch(endpoint, requestOptions);
    const courses = await response.json();
    
    const teacherCourses = courses.filter(course => {
      const teacherEnrollments = course.enrollments.filter(enrollment => enrollment.type === 'teacher');
      return teacherEnrollments.length > 0;
    });

    res.status(200).json(teacherCourses);
  } catch (error) {
    next(error);
  }
});

// Route for getting student courses
router.get('/course/student', setCommonRequestOptions, async (req, res, next) => {
  try {
    const { requestOptions } = req;
    const endpoint = CANVAS_BASE_URL + 'courses';
    const response = await fetch(endpoint, requestOptions);
    const courses = await response.json();
    
    const studentCourses = courses.filter(course => {
      const studentEnrollments = course.enrollments.filter(enrollment => enrollment.type === 'student');
      return studentEnrollments.length > 0;
    });

    res.status(200).json(studentCourses);
  } catch (error) {
    next(error);
  }
});

// Route for getting modules
router.get('/modules/:courseID', setCommonRequestOptions, async (req, res, next) => {
  try {
    const { requestOptions } = req;
    const courseID = req.params.courseID;
    const endpoint = CANVAS_BASE_URL + `courses/${courseID}/modules`;
    const response = await fetch(endpoint, requestOptions);
    const modules = await response.json();
    res.status(200).json(modules);
  } catch (error) {
    next(error);
  }
});

// Route for getting module files
router.get('/modules/files/:courseID/:moduleID', setCommonRequestOptions, async (req, res, next) => {
  try {
    const { requestOptions } = req;
    const courseID = req.params.courseID;
    const moduleID = req.params.moduleID;
    const endpoint = CANVAS_BASE_URL + `courses/${courseID}/modules/${moduleID}/items`;
    const response = await fetch(endpoint, requestOptions);
    const items = await response.json();

    const files = [];
    for (const item of items) {
      const responseData = await fetch(item.url, requestOptions);
      const file = await responseData.json();
      files.push(file);
    }

    const filteredFiles = files.filter(file => {
      const fileExtension = file.filename.split('.').pop().toLowerCase();
      return allowedExtensions.includes('.' + fileExtension);
    });

    res.status(200).json(filteredFiles);
  } catch (error) {
    next(error);
  }
});

// Route for getting course files
router.get('/files/:courseID', setCommonRequestOptions, async (req, res, next) => {
  try {
    const { requestOptions } = req;
    const courseID = req.params.courseID;
    const endpoint = CANVAS_BASE_URL + `courses/${courseID}/files`;
    const response = await fetch(endpoint, requestOptions);
    const data = await response.json();

    const filteredFiles = data.filter(file => {
      const fileExtension = file.filename.split('.').pop().toLowerCase();
      return allowedExtensions.includes('.' + fileExtension);
    });

    res.status(200).json(filteredFiles);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
router.use(errorHandler);

module.exports = router;

