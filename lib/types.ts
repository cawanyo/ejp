// lib/types.ts
export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: Date;
    registrationDate: Date;
    parentName?: string | null;
    parentPhone?: string | null;
    address?: string;
    notes?: string | null;
    createdAt?: Date | string,
    updatedAt?: Date | string,

  latitude?: number | null;
  longitude?: number | null;
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


  // Add these to lib/types.ts

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: string,
  createdAt?: Date | string,
  updatedAt?: Date | string,
}

export interface Family {
  id: string
  name: string
  address: string
  piloteId: string | null
  copiloteId: string | null
  pilote?: User | null
  copilote?: User | null
  members: Member[]
  _count?: {
    members: number
  },
  createdAt?: Date | string,
  updatedAt?: Date | string,
}

// Existing Member interface...