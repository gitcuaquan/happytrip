import type { BodyFilter, Parameters } from "~/model/FilterModal";

export interface City {
    id: string
    name: string
    code: string,
    status:boolean
}

export interface District {
    name: string
    status: boolean
}

export interface CityDetails {
    id: string,
    name: string,
    status: boolean,
    districts: District[]
}

export class CityService {
    private token: string
    constructor() {
        const token = useCookie('accessToken')
        this.token = `Bearer ${token.value}`
    }

    async getCityAsync(parameters: Partial<Parameters>, bodyFilter?: Partial<BodyFilter>): Promise<City[]> {
        const city = await $fetch<City[]>(`${BASE_URL}/city/list`, {
            headers: {
                Authorization: this.token
            },
            params: parameters,
            method: "POST",
            body: bodyFilter
        })
        return city
    }

    async getCityDetailAsync(id: string) {
        return await $fetch<CityDetails>(`${BASE_URL}/city/${id}`, {
            method: "GET",
            headers: {
                Authorization: this.token
            }
        })
    }
}