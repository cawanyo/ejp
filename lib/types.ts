// lib/types.ts
export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: Date 
    registrationDate: Date 
    parentName?: string | null;
    parentPhone?: string | null;
    address?: string;
    notes?: string | null;
    createdAt?: Date 
    updatedAt?: Date

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
  createdAt?: Date 
  updatedAt?: Date 
}

export interface Family {
  id: string
  name: string
  address: string
  latitude?: number | null;
  longitude?: number | null;
  piloteId: string | null
  copiloteId: string | null
  pilote?: User | null
  copilote?: User | null
  members: Member[]
  _count?: {
    members: number
  },
  createdAt?: Date 
  updatedAt?: Date 
}

// Existing Member interface...