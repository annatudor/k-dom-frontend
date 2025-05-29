import API from "./axios";
import type { AuditLogReadDto, AuditLogFilterDto } from "../types/AuditLog";
import type { PagedResult } from "../types/Pagination";
//  Toate logurile (admin only)
export const getAllAuditLogs = async (): Promise<AuditLogReadDto[]> => {
  const res = await API.get("/audit-log");
  return res.data;
};

//  Cu filtre (admin only)
export const getFilteredAuditLogs = async (
  filters: AuditLogFilterDto
): Promise<PagedResult<AuditLogReadDto>> => {
  const res = await API.get("/audit-log/filter", { params: filters });
  return res.data;
};
