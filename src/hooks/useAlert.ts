import { useContext } from 'react'
import { GlobalContext } from 'family/GlobalProvider'

export const useAlert = () => {
  const { confirm } = useContext(GlobalContext)
  return confirm
}
