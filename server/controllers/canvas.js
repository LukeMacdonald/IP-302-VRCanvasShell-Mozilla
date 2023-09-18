'use strict'

const express = require('express');
const router = express.Router();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const { CANVAS_BASE_URL  } = require('../config/config');

// Enable Stealth Mode
puppeteer.use(StealthPlugin());

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

// Enable Stealth Mode
puppeteer.use(StealthPlugin());

let browser;
let page;

async function runBot() {
    // Create a new page within the existing browser
    page = await browser.newPage();
    await page.goto(CANVAS_BASE_URL);
    // Fill out a form (assuming there's a form with ID 'exampleForm') 
}

async function canvasLogin(id, password){
  await page.goto(CANVAS_BASE_URL);
  await page.waitForSelector('#Ecom_User_ID');
  await page.type('#Ecom_User_ID', id);
  await page.waitForSelector('#Ecom_Password');
  await page.type('#Ecom_Password', password);
  await page.waitForSelector('#loginButton2');
  await page.click('#loginButton2'); 
  await page.waitForSelector('#DashboardCard_Container', { timeout: 10000 });
}

async function getContent(endpoint) {
    // Wait for the network idle state to make sure all the JavaScript has loaded
    await page.goto(`${CANVAS_BASE_URL}/api/v1/${endpoint}`);

    // Wait for a specific element to ensure that the page has loaded completely
    await page.waitForSelector('pre');

    // Extract the JSON data from the page
    const courseData = await page.evaluate(() => {
        const preElement = document.querySelector('pre');
        if (preElement) {
            return JSON.parse(preElement.textContent);
        } else {
            return null; // Handle the case where the JSON data is not found
        }
    });
    return courseData;
}

async function getContentUsingURL(endpoint) {
  // Wait for the network idle state to make sure all the JavaScript has loaded
  await page.goto(endpoint);

  // Wait for a specific element to ensure that the page has loaded completely
  await page.waitForSelector('pre');

  // Extract the JSON data from the page
  const courseData = await page.evaluate(() => {
      const preElement = document.querySelector('pre');
      if (preElement) {
          return JSON.parse(preElement.textContent);
      } else {
          return null; // Handle the case where the JSON data is not found
      }
  });
  return courseData;
}

async function startBot() {
  try {
      const isProduction = process.env.NODE_ENV === 'production';

      const launchOptions = {
          headless: true,
      };

      if (isProduction) {
          // Production configuration
          const chromiumPath = '/usr/bin/chromium-browser';
          launchOptions.executablePath = chromiumPath;
      }

      browser = await puppeteer.launch(launchOptions);
      console.log("Bot starting...");
      await runBot();
      console.log("Bot now running...");

  } catch (error) {
    console.error('Error in starting the bot:', error.message);
  }
}

router.post('/signin', setCommonRequestOptions, async (req, res, next) => { 
  const id = req.body.id;
  const password = req.body.password
  try{
    console.log('Attempting to log in...');
    await canvasLogin(id, password);
    console.log('Login successful!');
    res.status(200).json("Login Successful!");
  }
  catch(error){
    console.error('Login Failed: ', error.message);
    res.status(404).json("Login Failed!");
  }
})

// Route for getting teacher courses
router.get('/course/teacher', setCommonRequestOptions, async (req, res, next) => {
  try {

    const courses = await getContent("courses");

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

    const courses = await getContent("course");
    
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
    const courseID = req.params.courseID;
    const modules = await getContent(`courses/${courseID}/modules`);
    res.status(200).json(modules);
  } catch (error) {
    next(error);
  }
});

// Route for getting module files
router.get('/modules/files/:courseID/:moduleID', setCommonRequestOptions, async (req, res, next) => {
  try {

    const courseID = req.params.courseID;

    const moduleID = req.params.moduleID;

    const items = await getContent(`courses/${courseID}/modules/${moduleID}/items`);

    const files = [];
    for (const item of items) {
      const file = await getContentUsingURL(item.url);
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

    const courseID = req.params.courseID;

    const data = await getContent(`courses/${courseID}/files`);

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

module.exports = {
  router,
  startBot, // Export the runBot function
};