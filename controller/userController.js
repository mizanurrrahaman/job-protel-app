import { catchAsyncError } from "../middlerwares/catchAsyncError.js";
import ErrorHandler from "../middlerwares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js"
export const register = catchAsyncError(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      role,
      firstNiche,
      secoundNiche,
      thiredNiche,
      coverLetter,
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !address || !password || !role) {
      return next(new ErrorHandler("All fields are required.", 400));
    }

    // Validate job niches if role is "Job Seeker"
    if (
      role === "Job Seeker" &&
      (!firstNiche || !secoundNiche || !thiredNiche)
    ) {
      return next(
        new ErrorHandler("Please provide all three preferred job niches.", 400)
      );
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already registered.", 400));
    }

    // Prepare user data
    const userData = {
      name,
      email,
      phone,
      address,
      password,
      role,
      niches: { firstNiche, secoundNiche, thiredNiche },
      coverLetter,
    };

    // Handle resume upload
    if (req.files && req.files.resume) {
      const { resume } = req.files;
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          resume.tempFilePath,
          { folder: "Job_Seekers_Resume" }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return next(
            new ErrorHandler("Failed to upload resume to the cloud.", 500)
          );
        }
        userData.resume = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        };
      } catch (error) {
        return next(new ErrorHandler("Failed to upload resume.", 500));
      }
    }
    // Create user
    const user = await User.create(userData);
    sendToken(user, 201, res, "User Registered.")
  } catch (error) {
    next(error);
  }
});
export const login = catchAsyncError(async (req, res, next) => {
  const { role, email, password } = req.body;
  if (!role || !email || !password) {
    return next(
      new ErrorHandler("Email, password and role are required.", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  if (user.role !== role) {
    return next(new ErrorHandler("Invalid user role.", 400));
  }
  sendToken(user, 200, res, "User logged in successfully.");
});

export const logout = catchAsyncError(async(req, res, next) =>{
  res.status(200).cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  }).json({
    success: true,
    message: "Logged out successfully."
  })
})

{/*
  export const register = catchAsyncError(async (req, res, next) => {
    try {
      const {
        name,
        email,
        phone,
        address,
        password,
        role,
        firstNiche,
        secoundNiche,
        thiredNiche,
        coverLetter,
      } = req.body;
  
      // Validate required fields
      if (!name || !email || !phone || !address || !password || !role) {
        return next(new ErrorHandler("All fields are required.", 400));
      }
  
      // Validate job niches if role is "Job Seeker"
      if (
        role === "Job Seeker" &&
        (!firstNiche || !secoundNiche || !thiredNiche)
      ) {
        return next(
          new ErrorHandler("Please provide all three preferred job niches.", 400)
        );
      }
  
      // Check if email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new ErrorHandler("Email is already registered.", 400));
      }
  
      // Prepare user data
      const userData = {
        name,
        email,
        phone,
        address,
        password,
        role,
        niches: { firstNiche, secoundNiche, thiredNiche },
        coverLetter,
      };
  
      // Handle resume upload
      if (req.files && req.files.resume) {
        const { resume } = req.files;
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "Job_Seekers_Resume" }
          );
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(
              new ErrorHandler("Failed to upload resume to the cloud.", 500)
            );
          }
          userData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          };
        } catch (error) {
          return next(new ErrorHandler("Failed to upload resume.", 500));
        }
      }
      // Create user
      const user = await User.create(userData);
      sendToken(user, 201, res, "User Registered.")
    } catch (error) {
      next(error);
    }
  });
  export const login = catchAsyncErrors(async (req, res, next) => {
    const { role, email, password } = req.body;
    if (!role || !email || !password) {
      return next(
        new ErrorHandler("Email, password and role are required.", 400)
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password.", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password.", 400));
    }
    if (user.role !== role) {
      return next(new ErrorHandler("Invalid user role.", 400));
    }
    sendToken(user, 200, res, "User logged in successfully.");
  });
  
  export const logout = catchAsyncErrors(async(req, res, next) =>{
    res.status(200).cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    }).json({
      success: true,
      message: "Logged out successfully."
    })
  })
  export const login = catchAsyncError(async (req, res, next) => {
     const  { role, email, password } = req.body
     if(!role || !email || !password) {
       return next(
        new ErrorHandler("Email, password and role are required.", 400)
       );
     }
     const user = await User.findOne({ email }).select("+password");
     if(!user){
      return next(new ErrorHandler("Invalid email or password. From Email", 400))
     }
     const isPasswordMatched = await user.comparePassword(password);
     if(!isPasswordMatched){
       return next(new ErrorHandler("Invalid email or password. From Password", 400))
     }
     if(user.role !== role){
      return next(new ErrorHandler("Invalid user role.", 400))
     }
     
    sendToken(user, 200, res, "user login is successfully." )
  })
*/}


















// res.status(201).json({
    //   success: true,
    //   message: "User registered successfully.",
    // });











{/*
  import { catchAsyncError } from "../middlerwares/catchAsyncError.js";
  import  ErrorHandler  from "../middlerwares/error.js";
  import { User } from "../models/userSchema.js";
  import { v2 as cloudinary} from "cloudinary";
  
  
  export const register = catchAsyncError(async(req, res, next) =>{
    try {
      const {name, email, phone, address, password, role, firstNiche, secoundNiche, thiredNiche, coverLetter} = req.body
  
      if(name || email || phone || address || password || role){
        return next(new ErrorHandler("All fileds are required", 400))
      }
      if(role === "Job Seeker" && (firstNiche || secoundNiche || thiredNiche)){
          return next(new ErrorHandler("Please provide your preferred job niches", 400))
      }
  
      const existingUser = await User.findOne({email});
      if(existingUser){
          return next(new ErrorHandler("Email is already registored.", 400))
      }
  
      const userData = {
          name, email, phone, address, password, role, niches:{firstNiche, secoundNiche, thiredNiche},coverLetter
      };
      if(req.files && req.files.resume){
          const { resume } = req.files;
          if(resume){
             try{
              const cloudinaryResponse = await cloudinary.uploader.upload(
                 resume.tempFilePath,
                 { folder: "Job_Seekers_Resume"}
              );
              if(!cloudinaryResponse || cloudinaryResponse.error){
                 return next(
                   new ErrorHandler("Failed to upload resume to cloud.", 500)
                 );
              }
              userData.resume = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
              };
             } catch(error){
                return next(new ErrorHandler("Failed to upload resume", 500))
             }
          }
      }
  
      const user = await User.create(userData);
      res.status(201).json({
        success: true,
        message: "User Resister",
      })
  
  
    } catch (error) {
      next(error)
    }
  })

*/}

