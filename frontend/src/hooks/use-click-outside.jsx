import { useEffect } from 'react';

export function useOnClickOutside(ref, handler, mouseEvent = 'mousedown') {
  useEffect(() => {
    const listener = (event) => {
      const el = ref?.current
      const target = event.target

      // Do nothing if clicking ref's element or descendent elements
      if (!el || !target || el.contains(target)) {
        return
      }

      handler(event)
    }

    document.addEventListener(mouseEvent, listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener(mouseEvent, listener)
      document.removeEventListener('touchstart', listener)
    };
  }, [ref, handler, mouseEvent])
}