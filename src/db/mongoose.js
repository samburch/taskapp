const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)

// CRUD on REST API
// Create: POST
// Read: GET
// Update: PATCH
// Delete: DELETE