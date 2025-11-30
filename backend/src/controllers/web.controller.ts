import { Request, Response } from "express";
import * as adminService from "../services/admin.service";
import * as billingService from "../services/bill.service";

export const payBill = async (req: Request, res: Response) => {
  const { subscriberNo, month } = req.body;
  if (!subscriberNo || !month) {
    res.status(400).json({
      paymentStatus: "Error",
      transactionStatus: "Missing parameters",
    });
    return;
  }
  const result = await billingService.payBill(subscriberNo, month);
  if (!result) {
    res.status(404).json({ paymentStatus: "Error" });
    return;
  }

  res.status(200).json({ paymentStatus: "Successful" });
};

export const addBill = async (req: Request, res: Response) => {
  try {
    const { subscriberNo, month, billTotal } = req.body;

    if (!subscriberNo || !month || !billTotal) {
      res
        .status(400)
        .json({ transactionStatus: "Error", message: "Missing parameters" });
      return;
    }

    await adminService.createBill({ subscriberNo, month, billTotal });

    res.status(200).json({
      transactionStatus: "Successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      transactionStatus: "Error",
      message: "Bill creation failed",
    });
  }
};

export const addBatchBills = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res
        .status(400)
        .json({ transactionStatus: "Error", message: "CSV file not uploaded" });
      return;
    }

    await adminService.processBatchFile(req.file.path);

    res.status(200).json({
      transactionStatus: "Successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      transactionStatus: "Error",
      message: "File processing failed",
    });
  }
};
