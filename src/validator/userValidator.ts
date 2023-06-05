import { IUserParam } from "../model/user";
import validator from "validator";
import { createError } from "../utils/errorHandler";
import bcrypt from "bcryptjs";
import { checkEmailExist, checkUsernameExist } from "../controller/userController";

export const validateUserdata = async ({
                                         type,
                                         displayName,
                                         email,
                                         avatar,
                                         firstname,
                                         phone,
                                         lastname,
                                         age,
                                         bio,
                                         password,
                                         username,
                                       }: IUserParam) => {
  const errors: {
    [key: string]: string;
  }[] = [];

  const __ref = trimUserdata(
    firstname,
    lastname,
    username,
    displayName,
    email,
    password,
    phone,
    bio,
  );
  firstname = __ref.firstname;
  lastname = __ref.lastname;
  username = __ref.username;
  displayName = __ref.displayName;
  email = __ref.email;
  password = __ref.password;
  phone = __ref.phone;
  bio = __ref.bio;

  if (
    validator.isEmpty(username) ||
    !validator.isLength(username, {
      min: 3,
    })
  ) {
    errors.push({
      username: "username must have minimum length of 3",
    });
  }
  if (validator.isEmpty(firstname)) {
    errors.push({
      firstname: "firstname cannot be empty",
    });
  }
  if (validator.isEmpty(lastname)) {
    errors.push({
      lastname: "lastname cannot be empty",
    });
  }
  if (validator.isEmpty(displayName)) {
    displayName = username;
  }
  if (!validator.isEmail(email)) {
    errors.push({
      email: "invalid email",
    });
  }
  if (!!phone && !validator.isMobilePhone(phone)) {
    errors.push({
      phone: "invalid phone number",
    });
  }
  const passwordErrors = validatePassword(password);
  passwordErrors.forEach((err) => {
    errors.push(err);
  });

  if (errors.length > 0) {
    createError("Invalid data", 422, errors);
  }

  email = await checkUserdataExist(username, email);

  password = await bcrypt.hash(password, 12);
  return {
    firstname,
    lastname,
    username,
    displayName,
    email,
    password,
    phone,
    bio,
    type,
    age,
    avatar,
  };
};

export const checkUserdataExist = async (username: string, email: string) => {
  if (await checkUsernameExist(username)) {
    createError("Username exist", 400);
  }

  email = validator.normalizeEmail(email) as string;
  if (await checkEmailExist(email)) {
    createError("Email exist", 400);
  }
  return email;
};

export const trimUserdata = (
  firstname: string,
  lastname: string,
  username: string,
  displayName: string,
  email: string,
  password: string,
  phone: string | undefined,
  bio: string | undefined,
) => {
  firstname = validator.trim(firstname);
  lastname = validator.trim(lastname);
  username = validator.trim(username);
  displayName = validator.trim(displayName);
  email = validator.trim(email);
  password = validator.trim(password);
  if (phone != null) phone = validator.trim(phone);
  if (bio != null) bio = validator.trim(bio);
  return {
    firstname,
    lastname,
    username,
    displayName,
    email,
    password,
    phone,
    bio,
  };
};

function validatePassword(password: string): { [key: string]: string }[] {
  const errors: { [key: string]: string }[] = [];

  if (password.length < 8) {
    errors.push({ password: "Password should be at least 8 characters long." });
  }

  if (!/[a-z]/.test(password)) {
    errors.push({
      password: "Password should contain at least one lowercase letter.",
    });
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({
      password: "Password should contain at least one uppercase letter.",
    });
  }

  if (!/\d/.test(password)) {
    errors.push({ password: "Password should contain at least one digit." });
  }

  if (!/[@#$%^&+=]/.test(password)) {
    errors.push({
      password:
        "Password should contain at least one special character (@, #, $, %, ^, &, +, =).",
    });
  }

  return errors;
}
