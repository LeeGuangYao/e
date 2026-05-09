import { ref, watch, type Ref } from "vue"
import { useCityStore } from "@/stores/useCityStore"
import { apiFlightSearchCity } from "@/api/flight"
import type { CityItem } from "@/types/city"

export function useCitySearch(keyword: Ref<string>, countryType = 1) {
  const cityStore = useCityStore()
  const results = ref<CityItem[]>([])
  const searching = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  function localFilter(kw: string): CityItem[] {
    if (!kw) return []
    const lower = kw.toLowerCase()
    return cityStore.allCities.filter(
      (c) =>
        c.name.includes(kw) ||
        (c.pinyin && c.pinyin.toLowerCase().includes(lower)) ||
        c.code.toLowerCase().includes(lower) ||
        (c.firstLetter && c.firstLetter.toLowerCase().includes(lower))
    )
  }

  async function remoteSearch(kw: string): Promise<CityItem[]> {
    try {
      return await apiFlightSearchCity({ CountryType: countryType, KeyWord: kw })
    } catch {
      return []
    }
  }

  async function doSearch(kw: string): Promise<void> {
    if (!kw) {
      results.value = []
      searching.value = false
      return
    }

    searching.value = true
    const local = localFilter(kw)
    results.value = local

    try {
      const remote = await remoteSearch(kw)
      if (remote.length > 0) {
        const localCodes = new Set(local.map((c) => c.code))
        const merged = [...local, ...remote.filter((c) => !localCodes.has(c.code))]
        results.value = merged
      }
    } finally {
      searching.value = false
    }
  }

  watch(keyword, (val) => {
    if (timer) clearTimeout(timer)
    if (!val) {
      results.value = []
      return
    }
    timer = setTimeout(() => doSearch(val), 300)
  })

  return { results, searching }
}
