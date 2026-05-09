import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { CityItem, CityGroup } from "@/types/city"
import { apiFlightGetCityList } from "@/api/flight"

const RECENT_CITIES_KEY = "RecentCities"
const MAX_RECENT = 5

export const useCityStore = defineStore("city", () => {
  const allCities = ref<CityItem[]>([])
  const hotCities = ref<CityItem[]>([])
  const cityGroups = ref<CityGroup[]>([])
  const recentCities = ref<CityItem[]>([])
  const loaded = ref(false)

  const hotCityNames = computed(() => new Set(hotCities.value.map((c) => c.name)))

  function loadRecentCities(): void {
    try {
      const raw = localStorage.getItem(RECENT_CITIES_KEY)
      if (raw) {
        recentCities.value = JSON.parse(raw)
      }
    } catch {
      recentCities.value = []
    }
  }

  function addRecentCity(city: CityItem): void {
    const list = recentCities.value.filter((c) => c.code !== city.code)
    list.unshift(city)
    if (list.length > MAX_RECENT) list.length = MAX_RECENT
    recentCities.value = list
    localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(list))
  }

  function groupByLetter(cities: CityItem[]): CityGroup[] {
    const map = new Map<string, CityItem[]>()
    for (const city of cities) {
      const letter = (city.firstLetter || city.pinyin?.charAt(0) || city.name.charAt(0)).toUpperCase()
      if (!map.has(letter)) map.set(letter, [])
      map.get(letter)!.push(city)
    }
    const sorted = [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
    return sorted.map(([letter, items]) => ({
      letter,
      cities: items.sort((a, b) => (a.pinyin || a.name).localeCompare(b.pinyin || b.name)),
    }))
  }

  async function fetchCityList(force = false): Promise<void> {
    if (loaded.value && !force) return
    try {
      const data = await apiFlightGetCityList()
      allCities.value = data
      hotCities.value = data.filter((c) => c.isHot)
      cityGroups.value = groupByLetter(data)
      loaded.value = true
    } catch {
      allCities.value = []
      hotCities.value = []
      cityGroups.value = []
    }
  }

  loadRecentCities()

  return {
    allCities,
    hotCities,
    cityGroups,
    recentCities,
    loaded,
    hotCityNames,
    fetchCityList,
    addRecentCity,
  }
})
