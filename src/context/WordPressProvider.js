import {createContext, useContext} from 'react'

export const WPContext = createContext()

export function useWordPressContext() {
  return useContext(WPContext)
}

export default function WordPressProvider(props) {
  const {value, children} = props || {};

  return <WPContext.Provider value={value}>{children}</WPContext.Provider>
}
