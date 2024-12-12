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
