import ApiError from "../utils/ApiError.js";


export const validateRegister = (req, res, next) => {
  const { username, email, password, role } = req.body;

  
  if (!username || !email || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }


  if (
    [username, email, password, role].some(
      (field) => typeof field === "string" && field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Fields cannot be empty");
  }


  if (username.length < 3 || username.length > 30) {
    throw new ApiError(
      400,
      "Username must be between 3 and 30 characters"
    );
  }

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

 
  if (password.length < 8) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long"
    );
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must contain uppercase, lowercase, number and special character"
    );
  }

  const roles = ["user", "college", "government"];

  if (!roles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(
      400,
      "Username or Email is required"
    );
  }

  if (!password) {
    throw new ApiError(
      400,
      "Password is required"
    );
  }

  if (
    password.trim().length < 8
  ) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters"
    );
  }

  next();
};