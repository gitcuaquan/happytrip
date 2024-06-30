import type { BodyFilter, Parameters } from "~/model/FilterModal"

export const useFilter = () => {

  const parameters: Partial<Parameters> = reactive({
    page: 1,
    limit: 10,
    sort_by: "",
  })


  const bodyFilter: Partial<BodyFilter> = reactive({
    from_date_of_destination: new Date().toISOString().slice(0, 10),
  })


  return {
    parameters, bodyFilter
  }
}
