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
    type: Buffer,

  // },
  // image2: {
  //   type: Buffer,
  //
  // },
  // image3: {
  //   type: Buffer,
  //
  // },
  // image4: {
  //   type: Buffer,

  },
  type: {
    type:String,
    required:true
  }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
