import { apiClient } from "@/lib/api-client";

export interface SendLoginOtpPayload {
  email: string;
  lang?: "fr" | "en";
}

export interface SendLoginOtpData {
  statusCode?: number;
  success: boolean;
  message: string;
  email: string;
  cooldownSeconds?: number;
  expiresInSeconds?: number;
  user?: {
    name?: string;
    role?: string;
    avatar?: string;
  };
  devCode?: string;
}

export interface VerifyLoginOtpPayload {
  email: string;
  code: string;
  lang?: "fr" | "en";
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  tenantId: string;
}

export interface VerifyLoginOtpData {
  statusCode?: number;
  success: boolean;
  message: string;
  token: string;
  user: AuthenticatedUser;
}

export async function sendLoginOtpApi(payload: SendLoginOtpPayload): Promise<SendLoginOtpData> {
  const res = await apiClient<SendLoginOtpData>("auth/login-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return (res as any).data || (res as unknown as SendLoginOtpData);
}

export async function verifyLoginOtpApi(payload: VerifyLoginOtpPayload): Promise<VerifyLoginOtpData> {
  const res = await apiClient<VerifyLoginOtpData>("auth/verify-login-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return (res as any).data || (res as unknown as VerifyLoginOtpData);
}
