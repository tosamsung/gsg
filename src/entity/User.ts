export interface User {
    id: number;
    displayname: string;
    username: string;
    email: string;
    phone: string | null;
    appLang: string | null;
    systemSettings: object;
    partner_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    createdById: number | null;
    updatedById: number | null;
    passwordChangeTz: string | null;
  }
  