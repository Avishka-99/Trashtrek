export interface ICustomer {
    blue?: number,
    green?: number,
    red?: number,
    address?: string,
    phone?: string,
    email?: string,
    name?: string


}
export interface ICustomerState {
    customer: ICustomer | null,
}