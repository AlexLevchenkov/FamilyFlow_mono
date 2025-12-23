import { Type } from "@prisma/client";

export interface List {
  id: number;
  title: string;
  type: Type;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
