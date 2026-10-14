import { z } from "zod";

import { CUSTOMER_STATUSES } from "@/types/customer";

export const loginBody = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const noteBody = z.object({
  text: z.string().trim().min(1, "Note is empty").max(2000, "Keep notes under 2000 characters"),
});

export const statusBody = z.object({ status: z.enum(CUSTOMER_STATUSES) });

export const sendBody = z.object({
  customerId: z.string().min(1),
  matchId: z.string().min(1),
  subject: z.string().trim().min(1, "Subject is empty").max(200),
  body: z.string().trim().min(1, "Email body is empty").max(5000),
});
