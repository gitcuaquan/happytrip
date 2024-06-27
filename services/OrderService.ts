import type { BodyFilter, Pagination, Parameters } from "~/model/FilterModal"

export interface Booking {
    id: string;
    short_id: string;
    id_service: string;
    name_service: string;
    departure: {
        address_1: string;
        district: string;
        city: string;
    };
    destination: {
        address_1: string;
        district: string;
        city: string;
    };
    date_of_destination: string;
    quantity: number;
    price: number;
    price_guest: number;
    price_system: number;
    net_profit: number;
    created: string;
    customer: {
        full_name: string;
        phone: string;
    };
    status_type: number;
    status_name: string;
    total_transaction: number;
    creator: {
        user_id: string;
        user_phone: string;
        user_type: string;
    };
    note: string;
}

export class OrderService {
    private token: string
    constructor() {
        const token = useCookie('accessToken')
        this.token = `Bearer ${token.value}`
    }

    async getOrders(parameters?: Partial<Parameters>, bodyFilter?: Partial<BodyFilter>) {
        const orders = await $fetch<{ pagination: Pagination, data: Booking[] }>(`${BASE_URL}/order/list`, {
            headers: {
                Authorization: this.token
            },
            method: "POST",
            params: parameters,
            body: bodyFilter
        })
        return orders
    }

    async getOrdersCancelAsync(parameters?: Partial<Parameters>, bodyFilter?: Partial<BodyFilter>) {
        const orders = await $fetch<{
            pagination: Pagination,
            data: Booking[]
        }>(`${BASE_URL}/order_cancel/accept-list`, {
            headers: {
                Authorization: this.token
            },
            method: "POST",
            params: parameters,
            body: bodyFilter
        })
        return orders
    }

    acceptAsync(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const respone = await $fetch(`${BASE_URL}/order/${id}/accept`, {
                    method: "PUT",
                    headers: {
                        Authorization: this.token
                    },
                })
                resolve(respone)
            } catch (e) {
                reject(e)
            }
        })
    }

    completeAsync(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const respone = await $fetch(`${BASE_URL}/order/${id}/complete`, {
                    method: "PUT",
                    headers: {
                        Authorization: this.token
                    },
                })
                resolve(respone)
            } catch (e) {
                reject(e)
            }
        })
    }

    cancelAsync(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const respone = await $fetch(`${BASE_URL}/order/${id}/cancel`, {
                    method: "PUT",
                    headers: {
                        Authorization: this.token
                    },
                })
                resolve(respone)
            } catch (e) {
                reject(e)
            }
        })
    }
}