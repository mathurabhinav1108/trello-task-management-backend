const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/appError');
const User = require('../db/user');
const Tasks = require('../db/tasks');

exports.addtask = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError("Authorization header is missing or invalid!", 401));
    }
  
    const token = authHeader.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      userId = decoded.id;
      req.user = decoded; // Optional: Attach decoded user info to request object
    } catch (err) {
      return next(new AppError("Invalid token!", 401));
    }
  
    const { title, status, priority, deadline, description, type } = req.body;
    const taskUUID = uuidv4(); // Generate a UUID for the task
  
    const record = new Tasks({
      userId,
      uuid: taskUUID, // Add the UUID to the task
      type,
      title,
      status,
      priority,
      deadline,
      description,
    });
  
    const result = await record.save();
    if (result) {
      res.json({
        status: true,
        message: "Task added successfully",
        uuid: taskUUID, // Return the UUID in the response if needed
      });
    } else {
      res.status(500).json({
        status: false,
        error: result,
        message: "Failed to add task!",
      });
    }
  });

exports.gettask = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError("Authorization header is missing or invalid!", 401));
    }
  
    const token = authHeader.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      userId = decoded.id;
      req.user = decoded; // Attach user info to the request object
    } catch (err) {
      return next(new AppError("Invalid token!", 401));
    }
  
    try {
      // Fetch tasks associated with the userId
      const tasks = await Tasks.find({ userId: userId });
  
      // Check if tasks are found
      if (!tasks || tasks.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No tasks found for this user.",
          tasks:[]
        });
      }
  
      // Respond with the tasks
      res.json({
        status: true,
        message: "Tasks retrieved successfully!",
        tasks: tasks,
      });
    } catch (err) {
      // Handle errors in finding tasks
      return next(new AppError("Error fetching tasks!", 500));
    }
  });

  exports.deletetask = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError("Authorization header is missing or invalid!", 401));
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded; // Optional: Attach decoded user info to request object
    } catch (err) {
      return next(new AppError("Invalid token!", 401));
    }
  
    const { uuid } = req.body;
    if (!uuid) {
      return next(new AppError("UUID is required to delete a task!", 400));
    }
  
    try {
      const result = await Tasks.findOneAndDelete({ uuid: uuid });
      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Task not found!",
        });
      }
  
      res.json({
        status: true,
        message: "Task deleted successfully!",
      });
    } catch (err) {
      return next(new AppError("Failed to delete task!", 500));
    }
  });
