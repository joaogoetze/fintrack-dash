import { z } from "zod";

const walletSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome é obrigatório"),
  balance: z.coerce.number(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export const createWalletSchema = walletSchema.omit({ id: true, deletedAt: true });

export type CreateWalletInput = z.infer<typeof createWalletSchema>;

export const updateWalletSchema = walletSchema.omit({ id: true, deletedAt: true });

export type UpdateWalletInput = z.infer<typeof updateWalletSchema>;

export type Wallet = z.infer<typeof walletSchema>;

export { walletSchema };