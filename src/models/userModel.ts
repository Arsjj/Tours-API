/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Query } from "mongoose";
// import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date | number;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  active: {
    type: boolean;
    default: true;
    select: false;
  };
  role: {
    type: string;
    enum: Array<string>;
    default: string;
  };
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    // validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (this: IUser, el: string): boolean {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestapm: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000, 10).toString()
    );
    console.log(changedTimestamp, JWTTimestapm);
    return JWTTimestapm < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log({ a: resetToken, b: this.passwordResetToken });

  return resetToken;
};

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre("save", async function (next) {
  //only runs this function if password is actually modyfied
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});


userSchema.pre<Query<any, any>>(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});


const User = mongoose.model("User", userSchema);

export default User;
