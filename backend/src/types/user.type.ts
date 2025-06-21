import { UserRole } from "@prisma/client";

export interface GetAllUsersQuery {
  page?: string;
  limit?: string;
  role?: UserRole;
  isActive?: string;
  search?: string;
}
