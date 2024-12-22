import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";



export const isAuthenticated = catchAsyncErrors(async(req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHandler(" User is not authenticated.", 400));
    }
});