import { useContext } from 'react'
import { GlobalContext } from 'family/GlobalProvider'

export const useConfirm = () => {
  const { confirm } = useContext(GlobalContext)
  return confirm
}
