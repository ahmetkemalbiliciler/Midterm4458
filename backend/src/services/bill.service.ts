import { prisma } from "../lib/prisma";

export const payBill = async (subscriberNo: string, month: string) => {
  const bill = await prisma.bill.findFirst({ where: { subscriberNo, month } });
  if (!bill) return null;

  return await prisma.bill.update({
    where: { id: bill.id },
    data: { status: "PAID", paidAmount: bill.billTotal },
  });
};

export const getUnpaidBills = async (subscriberNo: string) => {
  return await prisma.bill.findMany({
    where: { subscriberNo, status: { not: "PAID" } },
    select: { month: true, billTotal: true, status: true },
  });
};
