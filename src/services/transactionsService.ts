import { Request, Response } from "express";
import dotenv from "dotenv";
import { MODEL_CONSTANTS } from "../constants/entityConstants";
import { ResponseBuilder } from "../helper/responseBuilder";
import DatabaseConnector from "../config/database";
import TransactionsModel from "../models/transactionsModel";
import * as MESSAGE from "../constants/responseConstants";
import { ModelType } from "../models/types";
import { ModelProvider } from "../helper/modelProvider";

// Load .env properties
dotenv.config();

const { TRANSACTIONS, DEBTS } = MODEL_CONSTANTS;

const responseBuilder = new ResponseBuilder();
const dbConnector = new DatabaseConnector();

const transactionModel: ModelType[typeof TRANSACTIONS] =
  new ModelProvider().getModel(TRANSACTIONS);

const debtModel: ModelType[typeof DEBTS] = new ModelProvider().getModel(DEBTS);

export async function createTransaction(req: Request, res: Response) {
  try {
    const { payerId, totalAmount, description, name, debts } = req.body;

    const transaction: TransactionsModel = await dbConnector
      .getInstance()
      .transaction(async (t) => {
        const transaction = await TransactionsModel.create(
          {
            payerId,
            totalAmount,
            description,
            name,
          },
          { transaction: t }
        );
        const bulkDebts = debts?.map((debt: typeof debtModel) => ({
          creditorId: payerId,
          fkTransactionId: transaction.pkTransactionId,
          ...(debt || []),
        }));
        console.log("bulkDebts", bulkDebts);

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
    console.error("ERROR [METHOD :: createTransaction]:", error);
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

export async function updateTransaction(req: Request, res: Response) {
  try {
    const { transactionId, payerId, totalAmount, description, name, debts } =
      req.body;
    // Input validation
    if (
      !transactionId ||
      !payerId ||
      totalAmount <= 0 ||
      !Array.isArray(debts)
    ) {
      return res
        .status(400)
        .json(
          responseBuilder.buildFailureResponse(
            [],
            MESSAGE.INVALID_ARGUMENTS,
            true,
            400
          )
        );
    }

    const updatedTransaction = await dbConnector
      .getInstance()
      .transaction(async (t) => {
        // Update the transaction record
        const [rowsUpdated] = await TransactionsModel.update(
          {
            payerId,
            totalAmount,
            description,
            name,
          },
          { where: { pkTransactionID: transactionId }, transaction: t }
        );

        if (!rowsUpdated) {
          throw new Error(
            "No records with the given transaction ID were found."
          );
        }

        // Remove existing debts for this transaction
        await debtModel.destroy({
          where: { fkTransactionId: transactionId },
          transaction: t,
        });

        // Insert the new debts
        const bulkDebts = debts.map((debt: typeof debtModel) => ({
          ...debt,
          creditorId: payerId,
          fkTransactionId: transactionId,
        }));

        if (bulkDebts.length) {
          await debtModel.bulkCreate(bulkDebts, { transaction: t });
        }

        // Fetch and return the updated transaction
        const transaction = await TransactionsModel.findByPk(transactionId, {
          transaction: t,
        });

        if (!transaction) {
          throw new Error("Transaction not found after update.");
        }

        return transaction; // TypeScript now knows this can't be null.
      });

    // Send success response
    res
      .status(200)
      .json(
        responseBuilder.buildSuccessResponse(
          { updatedTransaction },
          MESSAGE.TRANSACTION_UPDATE_SUCCESS,
          true,
          200
        )
      );
  } catch (error) {
    console.error("ERROR [METHOD :: updateTransaction]:", error);

    res
      .status(500)
      .json(
        responseBuilder.buildFailureResponse(
          [],
          MESSAGE.INTERNAL_SERVER_ERROR,
          true,
          500
        )
      );
  }
}


export async function deleteTransaction(req: Request, res: Response) {
  try {
    const { transactionId } = req.params;
    if (!transactionId) throw new Error(`TransactionId is : ${transactionId}`);
  } catch (error) {
    console.error("ERROR [METHOD :: deleteTransaction]:", error);
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
