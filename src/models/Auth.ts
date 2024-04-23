import mongoose, { Schema } from 'mongoose';

interface AuthType {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

const authSchema = new Schema<AuthType>({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    unique: true,
    // Custom validator for lowercase and no spaces
    validate: {
      validator: (value: string) => {
        // Check if username is lowercase
        const isLowerCase = value === value.toLowerCase();
        // Check if username has no spaces
        const hasNoSpace = !/\s/.test(value);
        return isLowerCase && hasNoSpace;
      },
      message: (props) => `${props.value} is not a valid username. It should be all lowercase and contain no spaces.`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Validate email format using regular expression
    validate: {
      validator: (value: string) => {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`
    }
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

const AuthModel = mongoose.model('Auth', authSchema);

export default AuthModel;
