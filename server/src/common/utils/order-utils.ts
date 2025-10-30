import { ColumnStatus, Prisma } from '@prisma/client';
export interface ShiftParams {
  orderIndexCondition: Prisma.IntFilter;
  action: 'increment' | 'decrement';
}
export function getShiftParameters(
  oldIndex: number,
  newIndex: number,
): ShiftParams | null {
  if (newIndex > oldIndex) {
    return {
      orderIndexCondition: { gt: oldIndex, lte: newIndex },
      action: 'decrement',
    };
  } else if (newIndex < oldIndex) {
    return {
      orderIndexCondition: { gte: newIndex, lt: oldIndex },
      action: 'increment',
    };
  }
  return null;
}
export async function updateOrderIndices(
  prisma: Prisma.TransactionClient,
  boardId: string,
  column: ColumnStatus,
  orderIndexCondition: Prisma.IntFilter,
  action: 'increment' | 'decrement',
  excludeCardId?: string,
) {
  const dataUpdate =
    action === 'increment'
      ? { orderIndex: { increment: 1 } }
      : { orderIndex: { decrement: 1 } };

  const whereCondition: Prisma.CardWhereInput = {
    boardId: boardId,
    column: column,
    orderIndex: orderIndexCondition,
  };

  if (excludeCardId) {
    whereCondition.id = { not: excludeCardId };
  }

  await prisma.card.updateMany({
    where: whereCondition,
    data: dataUpdate,
  });
}
