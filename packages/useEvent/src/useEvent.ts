import {useEffect, useRef} from 'react'

export function useEvent(
  event: string,
  callback: EventListener,
  options?: boolean | AddEventListenerOptions,
  element?: HTMLElement | null
): void {
  const currentCallback = useRef(callback)

  useEffect(
    function saveCallbackOnChange() {
      currentCallback.current = callback
    },
    [callback]
  )

  useEffect(
    function registerEvent() {
      function onEventTrigger(e: Event): void {
        currentCallback.current(e)
      }

      const eventElement = element || window
      eventElement.addEventListener(event, onEventTrigger, options)

      return function unregisterEvent() {
        eventElement.removeEventListener(event, onEventTrigger, options)
      }
    },
    [event, options, element]
  )
}
