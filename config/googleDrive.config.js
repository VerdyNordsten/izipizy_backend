const { google } = require("googleapis")
const fs = require("fs")

const SCOPES = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.appdata", "https://www.googleapis.com/auth/drive.file"]

const credential = {
  "type": process.env.GOOGLE_DRIVE_TYPE,
  "project_id": process.env.GOOGLE_DRIVE_PROJECT_ID,
  "private_key_id": process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
  "private_key": process.env.GOOGLE_DRIVE_PRIVATE_KEY,
  "client_email": process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
  "client_id": process.env.GOOGLE_DRIVE_CLIENT_ID,
  "auth_uri": process.env.GOOGLE_DRIVE_AUTH_URI,
  "token_uri": process.env.GOOGLE_DRIVE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.GOOGLE_DRIVE_AUTH_PROVIDER,
  "client_x509_cert_url": process.env.GOOGLE_DRIVE_CLIENT_URL
}

const auth = new google.auth.GoogleAuth({
  credentials: credential,
  scopes: SCOPES,
})

const driveService = google.drive({
  version: "v3",
  auth: auth,
})

/**
 * Uploads a file to Google Drive.
 * @param {object} file - The file to upload, containing a `path` and `filename`.
 * @param {string} mimeType - The MIME type of the file to upload.
 * @returns {Promise<object>} A Promise that resolves to the file metadata of the uploaded file.
 */
async function uploadFile(file, mimeType) {
  const fileMetadata = {
    name: file.filename,
    parents: [process.env.GOOGLE_DRIVE_PARENT_FOLDER],
  }

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(file.path),
  }

  try {
    const response = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    })

    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * Updates a file in Google Drive.
 * @param {object} file - The file to update, containing a `path` and `filename`.
 * @param {string} mimeType - The MIME type of the file to update.
 * @param {string} id - The ID of the file to update.
 * @returns {Promise<object>} A Promise that resolves to the file metadata of the updated file.
 */
async function updateFile(file, mimeType, id) {
  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(file.path),
  }

  try {
    const response = await driveService.files.update({
      fileId: id,
      media: media,
      fields: "id",
    })

    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}


/**
 * Deletes a file from Google Drive.
 * @param {string} id - The ID of the file to delete.
 * @returns {Promise<object>} A Promise that resolves to an empty object if the file was successfully deleted.
 */
async function deleteFile(id) {
  try {
    const response = await driveService.files.delete({
      fileId: id,
    })

    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  updateFile,
  deleteFile,
  uploadFile,
  auth,
}