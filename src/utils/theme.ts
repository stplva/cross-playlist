import { useState, useEffect } from 'react'

export const useThemeColor = (cssVariable: string) => {
  const [color, setColor] = useState('')

  useEffect(() => {
    const updateColor = () => {
      const rootStyles = getComputedStyle(document.documentElement)
      const value = rootStyles.getPropertyValue(cssVariable).trim()
      setColor(value)
    }

    updateColor()

    // Listen for theme changes for dynamic updates
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateColor)

    return () => {
      mediaQuery.removeEventListener('change', updateColor)
    }
  }, [cssVariable])

  return color
}

export const useMediaQuery = (query: string): boolean => {
  const actualWindow = typeof window !== 'undefined' ? window : null
  const [value, setValue] = useState({ query, matches: false })

  useEffect(() => {
    if (!(actualWindow && typeof actualWindow.matchMedia === 'function')) return
    const mql = actualWindow.matchMedia(query)
    setValue({ query, matches: mql.matches })

    const changeHandler = (mql: MediaQueryListEvent) => {
      setValue((prev) => {
        return { ...prev, matches: mql.matches }
      })
    }

    mql.onchange = changeHandler

    return () => {
      mql.onchange = null
    }
  }, [actualWindow])

  return value.matches
}

export const useIsTablet = () => {
  return useMediaQuery('screen and (min-width: 640px)')
}
