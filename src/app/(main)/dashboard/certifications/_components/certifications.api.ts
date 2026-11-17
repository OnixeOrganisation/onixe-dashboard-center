import { apiClient } from "@/lib/api-client";

import type { DiplomaItem } from "./data";

export interface IssueDiplomaPayload {
  studentName: string;
  studentMatricule?: string;
  studentId?: string;
  degreeTitle: string;
  cohort?: string;
  graduationDate?: string;
  honors?: DiplomaItem["honors"];
  cumulativeGpa?: number;
}

export interface VerificationResult {
  diplomaHash: string;
  isValid: boolean;
  status: string;
  studentName?: string;
  degreeTitle?: string;
  graduationDate?: string;
  honors?: string;
  certificateNumber?: string;
  issuer: string;
  verifiedAt: string;
}

export async function fetchDiplomas(): Promise<DiplomaItem[]> {
  const response = await apiClient<DiplomaItem[]>("centre/diplomas");
  return response.data;
}

export async function issueDiplomaApi(payload: IssueDiplomaPayload): Promise<DiplomaItem> {
  const response = await apiClient<DiplomaItem>("centre/diplomas/issue", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function verifyDiplomaApi(hash: string): Promise<VerificationResult> {
  const response = await apiClient<VerificationResult>(`centre/diplomas/verify/${encodeURIComponent(hash)}`);
  return response.data;
}

export async function updateDiplomaStatusApi(diplomaId: string, status: DiplomaItem["status"]): Promise<DiplomaItem> {
  const response = await apiClient<DiplomaItem>(`centre/diplomas/${diplomaId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return response.data;
}
