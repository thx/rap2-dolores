import React from 'react'
import { INumItem, User } from '../../actions/types'
import Select from './Select'

export type SelectedItem = Pick<User, 'id' | 'fullname'>

interface Props {
  loadOptions?: (input: string) => Promise<INumItem[]>
  options?: INumItem[]
  isMulti?: boolean
  selected?: INumItem[]
  value?: INumItem[]
  minWidth?: number
  onChange: (selected: SelectedItem[]) => void
}

function UserList(props: Props) {
  const { loadOptions, options, isMulti, selected, value, minWidth, onChange } = props
  return (
    <Select
      loadOptions={loadOptions}
      options={options}
      value={selected || value}
      minWidth={minWidth}
      isMulti={isMulti}
      onChange={(vals: INumItem[] | INumItem) => {
        if (vals === undefined || vals === null) {
          onChange([])
        } else if (Array.isArray(vals)) {
          onChange(vals.map(x => ({ id: x.value, fullname: x.label })))
        } else {
          onChange([{ id: vals.value, fullname: vals.label }])
        }
      }}
    />
  )
}

export default UserList
