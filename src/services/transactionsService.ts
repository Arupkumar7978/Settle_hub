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
      res
        .status(400)
        .json(
          responseBuilder.buildFailureResponse(
            [],
            MESSAGE.INVALID_ARGUMENTS,
            true,
            400
          )
        );
      return;
    }

    const updatedTransaction = await dbConnector
      .getInstance()
      .transaction(async (t) => {
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

        await debtModel.destroy({
          where: { fkTransactionId: transactionId },
          transaction: t,
        });

        const bulkDebts = debts.map((debt: typeof debtModel) => ({
          ...debt,
          creditorId: payerId,
          fkTransactionId: transactionId,
        }));

        if (bulkDebts.length) {
          await debtModel.bulkCreate(bulkDebts, { transaction: t });
        }

        const transaction = await TransactionsModel.findByPk(transactionId, {
          transaction: t,
        });

        if (!transaction) {
          throw new Error("Transaction not found after update.");
        }

        return transaction;
      });

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

    // Delete associated debts
    const deletedDebtsCount = await debtModel.destroy({
      where: { fkTransactionId: transactionId },
    });
    console.log(`Deleted ${deletedDebtsCount} debts for transaction ID: ${transactionId}`);

    const deletedCount = await TransactionsModel.destroy({
      where: { pkTransactionId: transactionId },
    });

    if (!deletedCount) {
       res.status(404).json({
        success: false,
        message: 'Transaction not found.',
        data: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.',
      data: [],
    });

    return;

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
