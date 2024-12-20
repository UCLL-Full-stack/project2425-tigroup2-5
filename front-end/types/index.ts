export type Member = {
    readonly id?: number;
    readonly person?: Person;
};

export type Person = {
    id?: number;
    firstname?: string;
    surname?: string;
    email?: string;
    phone?: string;
    birthDate?: Date;
};

export type Club = {
    id?: number;
    address?: string;
    region?: Region;
};

export type Region = {
    id?: number;
    name?: string;
};

export type Employee = {
    id?: number;
    admin?: boolean;
    title?: string;
    person?: Person;
    salary?: number;
};

export type Employment = {
    id?: number;
    startDate?: Date;
    endDate?: Date;
    employee?: Employee;
    club?: Club;
};

export type Enrollment = {
    id?: number;
    subscription?: Subscription;
    member?: Member;
    club?: Club;
    region?: Region;
};

export type Subscription = {
    id?: number;
    type?: string;
    price?: number;
};