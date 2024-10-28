import { Request, Response } from "express";
import JWT from "jsonwebtoken";
import { BeanProvider, BeanType } from "../models";
import { ENTITY_CONSTANTS } from "../constants/entityConstants";
import { ResponseBuilder } from "../utils/Helper/responseBuilder";
import bcrypt from "bcrypt";
import {
  USER_EXITS,
  USER_CREATED,
  INTERNAL_SERVER_ERROR,
} from "../constants/responseConstants";
import dotenv from "dotenv";

// Load .env properties
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const PASSWORD_SALT = parseInt(process.env.PASSWORD_SALT || "10") ?? 10;

const { USER } = ENTITY_CONSTANTS;

const responseBuilder = new ResponseBuilder();

const userBean: BeanType[typeof USER] = new BeanProvider().getBean(USER);

export async function AuthenticateUser(req: Request, res: Response) {
  res.send("Logged In .. !!");
}

export async function CreateNewUser(req: Request, res: Response) {
  try {
    const { name, email, userName, password } = req.body;

    // Encrypt user password
    const salt = bcrypt.genSaltSync(PASSWORD_SALT);
    const encrypted_password = bcrypt.hashSync(password, salt);

    const [user, created] = await userBean.findOrCreate({
      where: { email },
      defaults: {
        name,
        email,
        userName,
        password: encrypted_password,
      },
    });

    // created -> false , if already exists with same mail address .
    const { password: _, ...sanitisedUser } = user.toJSON();

    if (!created) {
      res
        .status(400)
        .json(
          responseBuilder.buildFailureResponse(
            { user: sanitisedUser },
            USER_EXITS.replace("<email>", email),
            false,
            402
          )
        );
      return;
    }

    const token = JWT.sign({ sanitisedUser }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res
      .status(200)
      .json(
        responseBuilder.buildSuccessResponse(
          { user: sanitisedUser, token },
          USER_CREATED.replace("<email>", email),
          true,
          200
        )
      );
  } catch (error) {
    console.error("ERROR [METHOD :: CreateNewUser]: ", error);
    res
      .status(500)
      .json(
        responseBuilder.buildFailureResponse(
          null,
          INTERNAL_SERVER_ERROR,
          false,
          500,
          `${error}`
        )
      );
  }
}
