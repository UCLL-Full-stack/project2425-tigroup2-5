type Role = 'admin' | 'employee' | 'member' | 'guest';

type PersonInput = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: Date;
};

type MemberInput = {
    id?: number;
    person: PersonInput;
};

type EmployeeInput = {
    id?: number;
    clubId: number;
    personNrn: string;
    salary: number;
};

type ClubInput = {
    id?: number;
    regionId: number;
    address: string;
};

type RegionInput = {
    id?: number;
    name: string;
};

type SubscriptionInput = {
    id?: number;
    type: string;
    price: number;
};

export {
    Role,
    PersonInput,
    MemberInput,
    EmployeeInput,
    ClubInput,
    RegionInput,
    SubscriptionInput,
};