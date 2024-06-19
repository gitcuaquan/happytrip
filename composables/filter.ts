import type { BodyFilter, Parameters } from "~/model/FilterModal"

export const useFilter = () => {

  const parameters: Partial<Parameters> = reactive({
    page: 1,
    limit: 10,
    sort_by: "",
  })


  const bodyFilter: Partial<BodyFilter> = reactive({
    keyword: "",
    short_id: "",
    id: "",
    creator_type: "",
    creator_ids: [],
    ids: [],
    from_date_of_destination: new Date().toISOString().slice(0, 10),
    city_diemdon: "",
    city_diemden: "",
    order_status: 0,
    partner_id: "",
    transport_type: 0,
    partner_creator_id: "",
    district_depature: "",
    district_destination: "",
    partner_ids: [],
  })


  return {
    parameters, bodyFilter
  }
}
