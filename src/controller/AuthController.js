const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../db/user');

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required!", 401));
  }

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(401).json({
      status: false,
      message: "Invalid Email or password",
    });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h', // Token expiration time
  });

  res.json({
    status: true,
    message: "Login Successfully!",
    token, // Send the token to the client
    user,
  });
});

exports.signup = catchAsync(async (req, res) => {
    const { name, email, password} = req.body;
    let isAlready = await User.findOne({ email: email });
    if (isAlready) {
      return res.status(200).json({
        status: false,
        message: "That user already exisits!",
      });
    }
    const record = new User({
        name: name,
      email: email,
      password: password,
    });
    const result = await record.save();
    if (result) {
      res.json({
        status: true,
        message: "You have been registred successfully !!.",
      });
    } else {
      res.json({
        status: false,
        error: result,
        message: "Failed to create user.",
      });
    }
  });
