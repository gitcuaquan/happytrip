export class OrderService {
    token: string
    constructor() {
        const token = useCookie('accessToken')
        this.token = `Bearer ${token.value}`
    }

    async getOrders() {
            const orders = $fetch(`${BASE_URL}/order/list`, {
                method:"POST"
            })
    }
}