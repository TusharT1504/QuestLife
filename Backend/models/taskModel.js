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
      enum: ['common', 'rare', 'epic' , 'legendary'],
      default: 'rare',
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
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate rewards based on difficulty
taskSchema.pre('save', function(next) {
  if (this.isModified('difficulty') || this.isNew) {
    const difficultyMultipliers = {
      common: { xp: 10, coins: 5 },
      rare: { xp: 25, coins: 10 },
      epic: { xp: 50, coins: 20 },
      legendary: { xp: 100, coins: 50 }
    };
    
    const multiplier = difficultyMultipliers[this.difficulty];
    this.xpReward = multiplier.xp;
    this.coinReward = multiplier.coins;
  }
  next();
});

// Index for better query performance
taskSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema); 