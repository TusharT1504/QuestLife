const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    xpReward: {
      type: Number,
      default: 10,
    },
    coinReward: {
      type: Number,
      default: 5,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    category: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate rewards based on difficulty
taskSchema.pre('save', function(next) {
  if (this.isModified('difficulty') || this.isNew) {
    const difficultyMultipliers = {
      easy: { xp: 10, coins: 5 },
      medium: { xp: 25, coins: 10 },
      hard: { xp: 50, coins: 20 }
    };
    
    const multiplier = difficultyMultipliers[this.difficulty];
    this.xpReward = multiplier.xp;
    this.coinReward = multiplier.coins;
  }
  next();
});

// Index for better query performance
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, completed: 1 });

const Task = mongoose.model("Task", taskSchema);
module.exports = Task; 