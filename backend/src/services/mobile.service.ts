import { prisma } from "../lib/prisma";

interface BillQuery {
  subscriberNo: string;
  month: string;
}

export const getBillSummary = async (query: BillQuery) => {
  return await prisma.bill.findMany({
    where: {
      subscriberNo: query.subscriberNo,
      month: query.month,
    },
    select: {
      billTotal: true,
      status: true,
    },
  });
};

export const getBillDetailed = async (
  query: BillQuery,
  page: number = 1,
  pageSize: number = 10
) => {
  const skip = (page - 1) * pageSize;

  const bills = await prisma.bill.findMany({
    where: {
      subscriberNo: query.subscriberNo,
      month: query.month,
    },
    skip: skip,
    take: pageSize,
    select: {
      billTotal: true,
      details: true,
    },
  });

  return bills;
};
