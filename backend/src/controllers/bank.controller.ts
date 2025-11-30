import { Request, Response } from "express";
import * as billingService from "../services/bill.service";

export const queryUnpaidBills = async (req: Request, res: Response) => {
  const { subscriberNo } = req.body;

  if (!subscriberNo) {
    res.status(400).json({ error: "Subscriber No is required" });
    return;
  }

  const unpaidBills = await billingService.getUnpaidBills(subscriberNo);

  res.status(200).json({ unpaidBills });
};
