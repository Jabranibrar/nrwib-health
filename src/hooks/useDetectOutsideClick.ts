import { useEffect } from 'react'

export const useDetectOutsideClick = (ref: any, hide: (e: any) => void) => {
  useEffect(() => {
    function handleClickOutside(event: any) {
      // TODO check key code for macOS
      if (
        ref.current &&
        !ref.current.contains(event.target)
        // ||
        // event.key === 'Escape' ||
        // event.keyCode === 27
      ) {
        hide(event)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    // document.addEventListener('keydown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      // document.removeEventListener('keydown', handleClickOutside)
    }
  }, [ref, hide])
}
