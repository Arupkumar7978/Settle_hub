import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { MODEL_CONSTANTS } from '../constants/entityConstants';
import { ResponseBuilder } from '../utils/Helper/responseBuilder';
import { BeanProvider, BeanType } from '../models';
import DatabaseConnector from '../config/database';
import TransactionsModel from '../models/transactionsModel';

// Load .env properties
dotenv.config();

const { TRANSACTIONS } = MODEL_CONSTANTS;

const responseBuilder = new ResponseBuilder();
const dbConnector = new DatabaseConnector();

const transactionModel: BeanType[typeof TRANSACTIONS] =
  new BeanProvider().getBean(TRANSACTIONS);
export async function createTransaction(req: Request, res: Response) {
  try {
    const { payerId, totalAmount, description, name, debts } =
      req.body;

    const transaction: TransactionsModel = await dbConnector
      .getInstance()
      .transaction(async (t) => {
        const transaction = await transactionModel.create({
          payerId,
          totalAmount,
          description,
          name
        });
        return transaction;
      });
    res
      .status(200)
      .json(
        responseBuilder.buildSuccessResponse(
          { transaction },
          'Transaction created successfully.',
          true,
          200
        )
      );
  } catch (error) {
    res
      .status(200)
      .json(
        responseBuilder.buildSuccessResponse(
          [],
          error as string,
          true,
          500
        )
      );
  }
}
export async function updateTrasnaction() {}
export async function deleteTransaction() {}
