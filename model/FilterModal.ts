export interface Parameters {
    page: number,
    limit: number,
    sort_by: string,
    fields:string
}
export interface BodyFilter {
    [key: string]:any;
    keyword: string;
    short_id: string;
    id: string;
    creator_type: string;
    creator_ids: string[];
    ids: string[];
    have_partner: boolean;
    order_status_value:string;
    order_cancel_type :string;
    from_date_of_destination: string;
    to_date_of_destination: string;
    city_diemdon: string;
    city_diemden: string;
    order_status: number;
    partner_id: string;
    transport_type: number;
    partner_creator_id: string;
    district_depature: string;
    district_destination: string;
    partner_ids: string[];
    order_expired: boolean;
}

export interface Pagination {
    page: number,
    limit: number,
    count: number,
    total_page: number
}