import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface UserInput {
  email: string;
  password: string;
  fullname: string;
  profilePicture?: string;
  isAdmin: boolean;
  points: number;
  refreshToken?: string | null;
}

interface UserDocument extends UserInput, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordValid: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre<UserDocument>("save", async function (this: UserDocument, next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(Number(process.env.SALT_FACTOR));
  const hashedPassword = bcrypt.hashSync(user.password, salt);

  user.password = hashedPassword;
  next();
});

userSchema.methods.isPasswordValid = async function (
  this: UserDocument,
  candidatePassword: string
): Promise<boolean> {
  const user = this;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
