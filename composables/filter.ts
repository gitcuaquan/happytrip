import type { BodyFilter, Parameters } from "~/model/FilterModal"
import { subMonths } from 'date-fns';
export const useFilter = () => {

  const parameters: Partial<Parameters> = reactive({
    page: 1,
    limit: 10,
    sort_by: "",
  })


  const bodyFilter: Partial<BodyFilter> = reactive({
    from_date_of_destination: subMonths(new Date(),6)
  })


  return {
    parameters, bodyFilter
  }
}
