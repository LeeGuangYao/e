export interface CityItem {
  name: string
  code: string
  pinyin?: string
  firstLetter?: string
  isHot?: boolean
  countryType?: number
}

export interface CityGroup {
  letter: string
  cities: CityItem[]
}

export interface CitySelectResult {
  name: string
  code: string
}
