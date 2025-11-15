import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must have at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (v) {
          return v === "" || /^[0-9]{10}$/.test(v);
        },
        message: "Phone number must be exactly 10 digits",
      },
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    profileImage: {
      type: String,
      default: "/uploads/profile/default.png",
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light", // Default theme
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
