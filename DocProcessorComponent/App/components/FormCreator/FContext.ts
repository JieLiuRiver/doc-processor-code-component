import { createContext, useContext } from 'react'
import type { ContextStore } from './type'

const FormCreatorContext = createContext<ContextStore>({} as ContextStore)

export const useStore = () => {
  return useContext(FormCreatorContext)
}

export default FormCreatorContext
