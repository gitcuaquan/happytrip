import type {IOrder} from "~/services/OrderService";
import type {ResponseBase} from "~/model/FilterModal";

export class HappyTripService {
    private token: string

    constructor() {
        const token = useCookie('accessToken')
        this.token = `Bearer ${token.value}`
    }

    async getListService() {
        const respone = await $fetch<ResponseBase<any>>(`${BASE_URL}/service/list?page=1&limit=-1&fields=id,name,description,transport_type,service_name`, {
            method: "POST",
            headers: {
                Authorization: this.token
            },
            body: {}
        })
        return respone?.data || []
    }
}