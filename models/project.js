const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image1: {
    type: String,

  },
  image2: {
    type: String,

  },
  image3: {
    type: String,

  },
  image4: {
    type: String,

  }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
