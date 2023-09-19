require('dotenv').config();

const HUBS_PUBLIC_URL= "https://canvas-hub.com/"
const CANVAS_BASE_URL= "https://rmit.instructure.com/api/v1/"
const CLIENT_URL= process.env.NODE_ENV === 'production' ? 'https://client.canvas-hub.com' : 'http://localhost:3001'

// Constants for file extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
const modelExtensions = ['.glb', '.gltf'];
const allowedExtensions = [...imageExtensions, ...modelExtensions, '.pdf', '.mp4'];

module.exports = {
    HUBS_PUBLIC_URL,
    CANVAS_BASE_URL,
    CLIENT_URL,
    allowedExtensions
}