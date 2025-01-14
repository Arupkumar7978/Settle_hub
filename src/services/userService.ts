import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { MODEL_CONSTANTS } from '../constants/entityConstants';
import { ResponseBuilder } from '../helper/responseBuilder';
import bcrypt from 'bcrypt';
import {
  USER_EXITS,
  USER_CREATED,
  INTERNAL_SERVER_ERROR,
  USER_DOES_NOT_EXITS,
  PASSWORD_MISMATCH,
  USER_LOGGEDIN
} from '../constants/responseConstants';
import dotenv from 'dotenv';
import { ModelType } from '../models/types';
import { ModelProvider } from '../helper/modelProvider';

// Load .env properties
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const PASSWORD_SALT =
  parseInt(process.env.PASSWORD_SALT ?? '10') || 10;

const { USER } = MODEL_CONSTANTS;

const responseBuilder = new ResponseBuilder();

const userModel: ModelType[typeof USER] =
  new ModelProvider().getModel(USER);

export async function AuthenticateUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      res
        .status(404)
        .json(
          responseBuilder.buildFailureResponse(
            null,
            USER_DOES_NOT_EXITS.replace('<email>', email),
            false,
            500
          )
        );
      return;
    }
    // check if both the password are same
    if (!bcrypt.compareSync(password, user?.password)) {
      res
        .status(401)
        .json(
          responseBuilder.buildFailureResponse(
            null,
            PASSWORD_MISMATCH,
            false,
            401
          )
        );
      return;
    }

    const { password: _, ...sanitisedUser } = user.toJSON();

    const token = JWT.sign({ sanitisedUser }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN
    });
    res
      .status(200)
      .json(
        responseBuilder.buildSuccessResponse(
          { user: sanitisedUser, token },
          USER_LOGGEDIN.replace('<email>', email),
          true,
          200
        )
      );
  } catch (error) {
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

export async function CreateNewUser(req: Request, res: Response) {
  try {
    const { name, email, userName, password } = req.body;

    // Encrypt user password
    const salt = bcrypt.genSaltSync(PASSWORD_SALT);
    const encrypted_password = bcrypt.hashSync(password, salt);

    const [user, created] = await userModel.findOrCreate({
      where: { email },
      defaults: {
        name,
        email,
        userName,
        password: encrypted_password
      }
    });

    // created -> false , if already exists with same mail address .
    const { password: _, ...sanitisedUser } = user.toJSON();

    if (!created) {
      res
        .status(400)
        .json(
          responseBuilder.buildFailureResponse(
            { user: sanitisedUser },
            USER_EXITS.replace('<email>', email),
            false,
            402
          )
        );
      return;
    }

    const token = JWT.sign({ sanitisedUser }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN
    });
    res
      .status(200)
      .json(
        responseBuilder.buildSuccessResponse(
          { user: sanitisedUser, token },
          USER_CREATED.replace('<email>', email),
          true,
          200
        )
      );
  } catch (error) {
    console.error('ERROR [METHOD :: CreateNewUser]: ', error);
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
