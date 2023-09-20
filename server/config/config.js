require('dotenv').config();
const fs = require('fs')

exports.HUBS_PUBLIC_URL= "https://canvas-hub.com/"
exports.CANVAS_BASE_URL= "https://rmit.instructure.com/api/v1/"
exports.CLIENT_URL= process.env.NODE_ENV === 'production' ? 'https://client.canvas-hub.com' : 'http://localhost:3001'

exports.allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif','.glb', '.gltf', '.pdf', '.mp4'];

// Load JSON data from a file
exports.loadJSONData = (name) => {
    try {
        const jsonData = fs.readFileSync(name, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("Error loading JSON data:", error);
        return {}; // Return an empty object or handle the error as appropriate
    }
}
  
  // Save JSON data to a file
exports.saveJSONData = (data, name) => {
    fs.writeFileSync(name, JSON.stringify(data, null, 2), 'utf-8');
}