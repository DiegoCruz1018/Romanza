import { PermissionDTO } from "../permissions/permissions";

export interface RoleDTO{
    id: number;
    name: string;
}

export interface CreationRoleDTO{
    name: string;
    permissionsIds: number[];
}

export interface RolePostGetDTO{
    permissions: PermissionDTO[];
}

export interface RolePutGetDTO{
    role: RoleDTO,
    noSelectedPermissions: PermissionDTO[],
    selectedPermissions: PermissionDTO[]
}