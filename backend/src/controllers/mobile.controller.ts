import { Request, Response } from "express";
import * as mobileService from "../services/mobile.service";

export const queryBill = async (req: Request, res: Response) => {
  const { subscriberNo, month } = req.body;

  if (!subscriberNo || !month) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  try {
    const bill = await mobileService.getBillSummary({ subscriberNo, month });

    if (!bill) {
      res.status(404).json({ message: "Bill not found" });
      return;
    }

    res.status(200).json({
      bills: bill,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const queryBillDetailed = async (req: Request, res: Response) => {
  const { subscriberNo, month } = req.body;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!subscriberNo || !month) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  try {
    const bills = await mobileService.getBillDetailed(
      { subscriberNo, month },
      page,
      limit
    );

    if (!bills || bills.length === 0) {
      res.status(404).json({ message: "Bill not found" });
      return;
    }

    res.status(200).json({
      page: page,
      pageSize: limit,
      results: bills,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
