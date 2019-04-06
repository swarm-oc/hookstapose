import {useState} from 'react'
import {IUseHover} from './types'

export function useHover(): IUseHover {
  const [isHovered, setIsHovered] = useState(false)

  function onMouseEnter(): void {
    setIsHovered(true)
  }

  function onMouseLeave(): void {
    setIsHovered(false)
  }

  return {
    isHovered,
    eventBinders: {
      onMouseEnter,
      onMouseLeave
    },
    setIsHovered
  }
}
