export interface IUser {
    id: number,
    name: string,
    role: number,
    address?: string,
    phone?: string,
    email?: string,
    current_month?: string


}

export interface IUserWaste {
    type: 1 | 2 | 3,
    category?: string,
    amount: number,
}

export interface ILocale {
    locale: string,
}

export interface IUserState {
    user: IUser | null,
    waste: IUserWaste[],
    locale: ILocale | null,
}