export interface IUsers {
    nick_name: string,
    contact_no?: string,
    address?: string,
}

export interface IAdminState {
    users: IUsers[] | null,
}