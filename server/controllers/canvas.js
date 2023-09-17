'use strict'

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL

router.get('/course/teacher', async (req, res) => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': req.headers['authorization']
        },
      }
      const endpoint = CANVAS_BASE_URL + `courses`;
      const response = await fetch(endpoint, requestOptions);
      const courses = await response.json();
  
      
      const studentCourses = courses.filter(course => {
        const studentEnrollments = course.enrollments.filter(enrollment => enrollment.type === 'teacher');
        return studentEnrollments.length > 0; // Include courses with student enrollments
      });
  
  
      res.status(200).json(studentCourses); // Optionally, send filtered courses as a response
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
});

router.get('/course/student', async (req, res) => {
  console.log(CANVAS_BASE_URL)
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': req.headers['authorization']
        },
      }
  
      const endpoint = CANVAS_BASE_URL + `courses`;
      const response = await fetch(endpoint, requestOptions);
      const courses = await response.json();
  
      const studentCourses = courses.filter(course => {
        const studentEnrollments = course.enrollments.filter(enrollment => enrollment.type === 'student');
        return studentEnrollments.length > 0; // Include courses with student enrollments
      });
  
      res.status(200).json(studentCourses); // Optionally, send filtered courses as a response
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
});

router.get('/modules/:courseID', async (req, res) => {
  try {
    const courseID = req.params.courseID;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      },
    }

    const endpoint = CANVAS_BASE_URL + `courses/${courseID}/modules`;
    const response = await fetch(endpoint,requestOptions);
    const modules = await response.json();

    res.status(200).json(modules);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

router.get('/modules/files/:courseID/:moduleID', async (req, res) => {
    try {
      const courseID = req.params.courseID;
      const moduleID = req.params.moduleID;
  
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': req.headers['authorization']
        },
      }
  
  
      const endpoint = CANVAS_BASE_URL + `courses/${courseID}/modules/${moduleID}/items`;
      const response = await fetch(endpoint, requestOptions);
      const items = await response.json();
  
      const files = [];
  
      for (const item of items) {
        const responseData = await fetch(item.url, requestOptions);
        const file = await responseData.json();
        files.push(file);
      }
      // Common image file extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  
      // Common 3D model file extensions
      const modelExtensions = ['.glb', '.gltf', '.obj', '.fbx'];
  
      // Additional allowed extensions
      const allowedExtensions = [
        ...imageExtensions,
        ...modelExtensions,
        '.pdf',
        '.mp4'
      ];
  
      // Filter files based on extensions
      const filteredFiles = files.filter(file => {
        const fileExtension = file.filename.split('.').pop().toLowerCase();
        return allowedExtensions.includes('.' + fileExtension);
      });
      res.status(200).json(filteredFiles);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
});

router.get('/files/:courseID', async (req, res) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      },
    }
    try {
      const courseID = req.params.courseID
      const endpoint = CANVAS_BASE_URL + `courses/${courseID}/files`;
      const response = await fetch(endpoint, requestOptions);
      const data = await response.json();
     
  
      // Common image file extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  
      // Common 3D model file extensions
      const modelExtensions = ['.glb', '.gltf', '.obj', '.fbx'];
  
      // Additional allowed extensions
      const allowedExtensions = [
        ...imageExtensions,
        ...modelExtensions,
        '.pdf',
        '.mp4'
      ];
  
      // Filter files based on extensions
      const filteredFiles = data.filter(file => {
        const fileExtension = file.filename.split('.').pop().toLowerCase();
        return allowedExtensions.includes('.' + fileExtension);
      });
  
      return res.json(filteredFiles);
    }
    catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;

