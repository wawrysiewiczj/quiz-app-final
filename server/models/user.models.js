import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    bio: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    badges: [String],
    settings: {
      notifications: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: "en",
      },
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

// Remove passwordConfirmation field before saving to the database
userSchema.pre("save", function (next) {
  this.passwordConfirmation = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
