export interface ICustomer {
    blue?: number,
    green?: number,
    red?: number,
    address?: string,
    phone?: string,
    email?: string,
    name?: string,
    penalty?: number,


}
export interface ICustomerState {
    customer: ICustomer | null,
}