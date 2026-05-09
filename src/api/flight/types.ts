import type { CityItem } from "@/types/city"

export interface SearchCityRequest {
  CountryType: number
  KeyWord: string
}

export type GetCityListResponse = CityItem[]

export type SearchCityResponse = CityItem[]
