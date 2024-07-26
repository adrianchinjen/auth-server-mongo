import mongoose, { Schema } from 'mongoose';

export interface UserType {
  auth_id: string;
  username: string;
  email: string;
  roles: string[];
}

const userSchema = new Schema<UserType>({
  auth_id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  roles: {
    type: [String]
  }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
