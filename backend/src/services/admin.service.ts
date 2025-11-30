import { prisma } from "../lib/prisma";
import fs from "fs";
import csv from "csv-parser";

interface CreateBillDto {
  subscriberNo: string;
  month: string;
  billTotal: number;
}

export const createBill = async (data: CreateBillDto) => {
  return await prisma.bill.create({
    data: {
      subscriberNo: data.subscriberNo,
      month: data.month,
      billTotal: data.billTotal,
      status: "UNPAID",
      //paidAmount: 0,
      //details: {},
    },
  });
};

export const processBatchFile = (filePath: string): Promise<any> => {
  const results: CreateBillDto[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        if (data.subscriberNo && data.month && data.billTotal) {
          results.push({
            subscriberNo: data.subscriberNo,
            month: data.month,
            billTotal: parseFloat(data.billTotal),
          });
        }
      })
      .on("end", async () => {
        try {
          const createdBills = await prisma.$transaction(
            results.map((bill) =>
              prisma.bill.create({
                data: {
                  subscriberNo: bill.subscriberNo,
                  month: bill.month,
                  billTotal: bill.billTotal,
                  status: "UNPAID",
                },
              })
            )
          );
          fs.unlinkSync(filePath);
          resolve({ count: createdBills.length, status: "Successful" });
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => reject(error));
  });
};
