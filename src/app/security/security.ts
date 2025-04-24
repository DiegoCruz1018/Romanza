import { RoleDTO } from "../roles/roles";

export interface CredentialsUsersDTO{
    name: string;
    lastname: string;
    phonenumber: string;
    email: string;
    password?: string;
    dateCreated: Date;
    rolesIds?: string[];
}

export interface UserPostGetDTO{
    roles: RoleDTO[];
}

export interface UserPutGetDTO{
    user: UserDTO;
    noSelectedRoles: RoleDTO[];
    selectedRoles: RoleDTO[];
}

export interface LoginDTO{
    email: string;
    password: string;
}

export interface ResponseAuthenticationDTO{
    token: string;
    expiration: Date;
}

export interface UserDTO extends CredentialsUsersDTO{
    id: string;
}