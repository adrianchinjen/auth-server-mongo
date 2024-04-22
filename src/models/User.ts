import mongoose, { Schema } from 'mongoose';

interface UserType {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

const userSchema = new Schema<UserType>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    default: ['user']
  }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
