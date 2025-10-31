import { createId } from '@paralleldrive/cuid2';
export const generateHashedId = (): string => {
  return createId();
};
