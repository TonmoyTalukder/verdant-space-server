// Interface → Model → Validation → Service → Controller → Route 

export type TUser = {
    name: string;
    email: string;
    password: string;
    contactNo: string;
    address: string;
    isAdmin: boolean;
    isDeleted?: boolean;  // Add soft delete field
  };
  