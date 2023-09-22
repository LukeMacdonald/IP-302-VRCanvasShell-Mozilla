const fetch = require('node-fetch');

const { CANVAS_BASE_URL, allowedExtensions } = require('../config/config');

exports.teacherCourses = async (req,res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      }
    }
    const endpoint = CANVAS_BASE_URL + 'courses?per_page=50';
    const response = await fetch(endpoint, requestOptions);
    const courses = await response.json();
    
    const teacherCourses = courses.filter(course => {
      const teacherEnrollments = course.enrollments.filter(enrollment => enrollment.type === 'teacher');
      return teacherEnrollments.length > 0;
    });
    res.status(200).json(teacherCourses);
  } catch (error) {
    res.status(500).json(error.message)
  }
}

exports.studentCourses = async (req,res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      }
    }
    const endpoint = CANVAS_BASE_URL + 'courses?per_page=50';
    const response = await fetch(endpoint, requestOptions);
    const courses = await response.json();
    
    const studentCourses = courses.filter(course => {
      const studentEnrollments = course.enrollments.filter(enrollment => enrollment.type === 'student');
      return studentEnrollments.length > 0;
    });
    res.status(200).json(studentCourses);
  } catch (error) {
    res.status(500).json(error.message)
  }
}

exports.modules = async (req,res) =>{
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      }
    }
    const courseID = req.params.courseID;
    const endpoint = CANVAS_BASE_URL + `courses/${courseID}/modules`;
    const response = await fetch(endpoint, requestOptions);
    const modules = await response.json();
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json(error.message)
  }
}

exports.moduleFiles = async (req, res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      }
    }
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
    res.status(500).json(error.message)
  }

}
exports.profile = async(req,res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      }
    }
    const endpoint = CANVAS_BASE_URL + `users/self/profile`;
    const response = await fetch(endpoint, requestOptions);
    const user = await response.json();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error.message)
  }
  
}

exports.courseFiles = async (req,res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      }
    }
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
    res.status(500).json(error.message)
  }
}