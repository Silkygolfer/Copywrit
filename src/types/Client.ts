interface Client {
    id?: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    createdAt: Date;
    updatedAt?: Date;
}

export type { Client };