import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { MODEL_CONSTANTS } from '../constants/entityConstants';
import { ResponseBuilder } from '../helper/responseBuilder';
import DatabaseConnector from '../config/database';
import TransactionsModel from '../models/transactionsModel';
import * as MESSAGE from '../constants/responseConstants';
import { ModelType } from '../models/types';
import { ModelProvider } from '../helper/modelProvider';

// Load .env properties
dotenv.config();

const { TRANSACTIONS, DEBTS } = MODEL_CONSTANTS;

const responseBuilder = new ResponseBuilder();
const dbConnector = new DatabaseConnector();

const transactionModel: ModelType[typeof TRANSACTIONS] =
  new ModelProvider().getModel(TRANSACTIONS);

const debtModel: ModelType[typeof DEBTS] =
  new ModelProvider().getModel(DEBTS);

export async function createTransaction(req: Request, res: Response) {
  try {
    const { payerId, totalAmount, description, name, debts } =
      req.body;

    const transaction: TransactionsModel = await dbConnector
      .getInstance()
      .transaction(async (t) => {
        const transaction = await TransactionsModel.create(
          {
            payerId,
            totalAmount,
            description,
            name
          },
          { transaction: t }
        );
        const bulkDebts = debts?.map((debt: typeof debtModel) => ({
          creditorId: payerId,
          fkTransactionId: transaction.pkTransactionId,
          ...(debt || [])
        }));
        console.log('bulkDebts', bulkDebts);

        await debtModel.bulkCreate(bulkDebts, { transaction: t });
        return transaction;
      });

    res
      .status(200)
      .json(
        responseBuilder.buildSuccessResponse(
          { transaction },
          MESSAGE.TRANSACTION_CREATE_SUCCESS,
          true,
          200
        )
      );
  } catch (error) {
    console.error('ERROR [METHOD :: createTransaction]:', error);
    res
      .status(200)
      .json(
        responseBuilder.buildSuccessResponse(
          [],
          MESSAGE.INTERNAL_SERVER_ERROR,
          true,
          500
        )
      );
  }
}
export async function updateTrasnaction() {}
export async function deleteTransaction() {}
