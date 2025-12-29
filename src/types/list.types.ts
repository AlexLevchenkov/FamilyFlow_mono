import { Type } from "@prisma/client";

export interface CreateListRequest {
  title: string;
  type: Type;
  color?: string;
  icon?: string;
}

export interface UpdateListRequest {
  title: string;
  type: Type;
  color?: string;
  icon?: string;
}
