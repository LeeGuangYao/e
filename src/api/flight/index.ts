import { HRequest } from "@/api/index"
import type { SearchCityRequest, GetCityListResponse, SearchCityResponse } from "./types"

/** 获取城市列表（热门城市 + 分组列表） */
export function apiFlightGetCityList(): Promise<GetCityListResponse> {
  return HRequest<GetCityListResponse>({
    url: "/api/flight/getFlightCityList",
    method: "GET",
  })
}

/** 城市模糊查询 */
export function apiFlightSearchCity(data: SearchCityRequest): Promise<SearchCityResponse> {
  return HRequest<SearchCityResponse>({
    url: "/api/flight/searchAirportCity/v2",
    method: "POST",
    data,
    onlyAcceptTheLatest: true,
  })
}
