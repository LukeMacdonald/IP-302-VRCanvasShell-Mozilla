const fetch = require('node-fetch');
const fs = require('fs').promises;
const FormData = require('form-data');

const { CANVAS_BASE_URL, allowedExtensions } = require('../config/config');

const { backup } = require('./database-controller');

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
exports.uploadFile = async (req, res) => {
  try {
    const course_id = req.params.courseID;
    const data = await backup(course_id);
    const jsonData = JSON.stringify(data, null, 2);

    // Save the JSON data to a file
    const filePath = 'backup.json';
    await fs.writeFile(filePath, jsonData);

   

    // Create FormData for the initial metadata request
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

    // Make the initial request to multipart file upload
    const initialEndpoint = CANVAS_BASE_URL + `courses/${course_id}/files`;
    const initialResponse = await fetch(initialEndpoint, initialRequestOptions);
    const initialResult = await initialResponse.json();
  
    // Create FormData for the file upload
    const fileData = new FormData();
    
    // Create a Blob from the file content
    const fileBlob = await fs.readFile(filePath);

    fileData.append('file', fileBlob, { filename: 'backup.json', contentType: 'application/json' });
    
    // Make the final request to upload the file using the obtained URL
    const finalRequestOptions = {
      method: 'POST',
      body: fileData,
    };

    const finalResponse = await fetch(initialResult.upload_url, finalRequestOptions);
    const finalResult = await finalResponse.json();
   

    // Delete the temporary backup file
    await fs.unlink(filePath);

    res.status(200).json({ message: 'Backup saved and uploaded successfully.', result: finalResult });
  } catch (error) {
    console.error('Error saving and uploading backup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};