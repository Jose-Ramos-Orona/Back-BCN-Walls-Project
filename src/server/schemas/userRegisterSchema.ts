import { Joi } from "express-validation";

const userRegisterSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
  }),
};

export default userRegisterSchema;
