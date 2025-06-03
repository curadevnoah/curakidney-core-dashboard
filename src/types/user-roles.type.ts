export enum UserRoles {
  ADMINISTRATOR = "administrator",
  NEPHROLOGIST = "nephrologist",
  STAFF = "staff",
  PATIENT = "patient",
}

export type UserRole = `${UserRoles}`;
