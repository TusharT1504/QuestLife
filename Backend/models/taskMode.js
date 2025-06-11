const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  completed: { type: Boolean, default: false },
  
  taskType: {
    type: String,
  },

  difficulty: {
    type: String,
  },

  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  }
});
