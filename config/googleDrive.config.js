const { google } = require("googleapis")
const fs = require("fs")

const SCOPES = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.appdata", "https://www.googleapis.com/auth/drive.file"]

const credential = {
  type: "service_account",
  project_id: "brave-cistern-378512",
  private_key_id: "b1b8649743cbf68742b89ccef1e78ace6bb94af7",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCV59nRmpS4USv2\nEgRb15/uh/BrXNQnEyNlrG880NIOFW1d7t4koU9KNH0HvxbV4j5KslEZibCZlXxH\ntm6vtfMR5/uiIxOKOrXfDkLWH6ILCrmxDpYFsCZ2gJyc0j5j8W3mlbTkgAPgXzpS\nhEIw/dtV2MvCyw+aGDeJWOxpbff72hXh4XS7/aD67qADcYvqHskrpXYyTNNLUsgh\n2JygaKosMLBh1dD5y5f+CVM780iQ+0512b+Uyx4rhQ95Nmm+W2cXwj828AZ48sa5\n+Wg8LpbUCPhsxJZFas+cHkawv0YsZ/BZV0AQxClUQRFy2EuR3cHRsvf7GKbsYNUD\nqb6MBJefAgMBAAECggEAAne4w2AMOa/bDZJvWu8E6swhvjVe0q6DIyiAWPEbvBqd\n3HF9sP8CIKJrj9CVTiZgHc0AqRnLUUPqMf4D+sV/1QLLcXhVWS2tPRjtgGaF6DD1\ngeolDb6Va4GjfQYNponcuXKBHKUqKyvgzbyaoFbVdlIldzVDh6cFZwU9OGEUjM3x\nnTZL8Yah44ryocN+S29e5UX+cmjjBu6s30UXUvnKx9MrPqokckxGLMp+dK4aA7CZ\nF6/lMPN3mSDUtcYI7MKwU8mchzaG+AfFz4ynrN9Br2wLEGiirYBEHRWwyCvUkOJF\nUeCPvhnyH8ehHeHuT1DJd50BNEkMh/Rl6a9OaTduNQKBgQDTrr9JBA2tP4lSBW++\nZPDG8icpXUrkbevDRsenGcwjsq4kSi0F8qnDsvonPFWIFoY8yu4lue+lLQ9N2bYp\nf8cE0q8//6uUgbA6FW7ltUDVC78NHKJIY7mWfLRt5PthRPRqRlVCcM4qre7t5XwC\nNiJRZVQP/j9wylHehew8X0QQOwKBgQC1SiHvpXMyDx61PmcIve7FSPuyap71CbBP\nVtzuEyP/n+yFkRnqhd+hfzlFvjpwH/t335oy3dNQWsiwbx02hkE7M31O/PWKoXXr\n6y763jCUu7yxgQI1pTIgFYh9Ree1bySJKdsL0uUNyG5SfnBzTP886i6zKR9qLbPf\nptvR3ESj7QKBgQDDGMGwGA5K6M41TFFrFzlbAv/Y/eTyl+S9O9TzS7F8DUi2pa7N\nVpPkjGZGFzN1k9zw1s+a8b3PbLI4PDnKEbxp04w13fxTiRvUzMBC8kTolkTlXsir\nE06PRiw9RNfzFEx4To5yB+ncKCaYF/OtThtfDZbmjpwF5lKCVsgd9GeU1QKBgG6+\n2ZpO5N8os2aet0x00n68Rd3JGk+wWn8tHgtlr/EBXfh+GmnU3DcIxBDh00sZjoG9\nG7KFJgiJXN3DEwJy4zhqDNuK1eiZF7NF2U4xG1ZQlUWN/K6Out80qEt2v8RrH9OW\nuRQxAfH4hcRpLwKQf79Tg7G4plMzlhVDFjfOKjRFAoGAD+k3DHlUaXmxWZbs5X7g\n+sEnsxxb5GXZMWTTNzCurXVq9WxIOwT1MMvdD62OBntJLjf4zsSHuI0DGcjTOSD0\nRhqaRCJYZqP3XhQyTMP0povqULespYA/1TrNdnhXCwi6Cde2d4+tuRsZ/4iTprs4\nsG7Un7ih+lPBaoTx9cPyV3g=\n-----END PRIVATE KEY-----\n",
  client_email: "izipizy-recipe@brave-cistern-378512.iam.gserviceaccount.com",
  client_id: "101841973697477486933",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/izipizy-recipe%40brave-cistern-378512.iam.gserviceaccount.com",
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
    parents: ["1NYF4vn0ZuaNvJlGnId2tgnsK2w5-hKSY"],
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
