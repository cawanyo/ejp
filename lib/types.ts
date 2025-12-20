// lib/types.ts
export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    registrationDate: string;
    parentName?: string | null;
    parentPhone?: string | null;
    address?: string;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Metadata {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
  
  export interface PaginatedResult {
    members: Member[];
    metadata: Metadata;
  }