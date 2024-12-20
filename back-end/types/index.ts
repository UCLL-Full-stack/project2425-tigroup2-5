type Role = 'admin' | 'employee' | 'member' | 'guest';

type PersonInput = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: Date;
};

type LoginDTO = {
    email: string;
    password: string;
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

type AuthenticationResponse = {
    token: string;
    email: string;
    fullname: string;
    role: Role;
};

export {
    Role,
    PersonInput,
    LoginDTO,
    EmployeeInput,
    ClubInput,
    RegionInput,
    SubscriptionInput,
    AuthenticationResponse
};