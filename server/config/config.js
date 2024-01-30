require("dotenv").config();
const fs = require("fs");

exports.HUBS_PUBLIC_URL = "https://test.canvas-hub.com/";
exports.CANVAS_BASE_URL = "https://rmit.instructure.com/api/v1/";

exports.allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".glb",
  ".gltf",
  ".pdf",
  ".mp4",
];

exports.enrollementTypes = {
  Student: "student",
  Staff: "teacher",
};
