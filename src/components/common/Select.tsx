import React, { HTMLAttributes } from 'react'
import { Chip, Typography, MenuItem, TextField, NoSsr, Paper } from '@material-ui/core'
import { emphasize } from '@material-ui/core/styles/colorManipulator'
import CancelIcon from '@material-ui/icons/Cancel'
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles'
import { BaseTextFieldProps } from '@material-ui/core/TextField'
import Select from 'react-select'
import clsx from 'clsx'
import { NoticeProps, MenuProps } from 'react-select/src/components/Menu'
import { ControlProps } from 'react-select/src/components/Control'
import { PlaceholderProps } from 'react-select/src/components/Placeholder'
import { SingleValueProps } from 'react-select/src/components/SingleValue'
import { ValueContainerProps } from 'react-select/src/components/containers'
import { MultiValueProps } from 'react-select/src/components/MultiValue'
import AsyncSelect from 'react-select/async'
import { OptionProps } from 'react-select/src/components/Option'
import { INumItem } from '../../actions/types'

const debounce = require('debounce-promise')

interface OptionType {
  label: string
  value: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(1),
    },
    input: {
      display: 'flex',
      padding: 0,
      height: 'auto',
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      bottom: 6,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing(2),
    },
  }),
)

function NoOptionsMessage(props: NoticeProps<OptionType>) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

type InputComponentProps = Pick<BaseTextFieldProps, 'inputRef'> & HTMLAttributes<HTMLDivElement>

function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />
}

function Control(props: ControlProps<OptionType>) {
  return (
    <TextField
      style={{ minWidth: props.selectProps.minWidth || 350 }}
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.TextFieldProps}
    />
  )
}

function Option(props: OptionProps<OptionType>) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isSelected}
      component="div"
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  )
}

function Placeholder(props: PlaceholderProps<OptionType>) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function SingleValue(props: SingleValueProps<OptionType>) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  )
}

function ValueContainer(props: ValueContainerProps<OptionType>) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>
}

function MultiValue(props: MultiValueProps<OptionType>) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={clsx(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  )
}

function Menu(props: MenuProps<OptionType>) {
  return (
    <Paper square={true} className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  )
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
}

interface Props {
  loadOptions?: (input: string) => Promise<INumItem[]>
  options?: INumItem[]
  isMulti?: boolean
  value?: INumItem | INumItem[]
  minWidth?: number
  isClearable?: boolean
  onChange: (value: INumItem | INumItem[]) => void
}

function MaterialSelect(props: Props) {
  const classes = useStyles()
  const theme = useTheme()
  const { loadOptions, isMulti = false, onChange, options, value, minWidth, isClearable = false } = props
  const selectStyles = {
    input: (base: any) => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  }
  const commonProps: any = {
    minWidth,
    cacheOptions: true,
    isMulti: isMulti,
    isClearable,
    noOptionsMessage: ({ inputValue }: { inputValue: string }) => {
      return inputValue && inputValue.trim() ? '搜不到数据' : '请输入检索关键字'
    },
    onChange,
    placeholder: `请选择(${isMulti ? '多选' : '单选'})`,
  }

  if (value) {
    (commonProps as any).value = value
  }

  if (loadOptions) {
    return (
      <div className={classes.root}>
        <NoSsr>
          <AsyncSelect
            classes={classes}
            loadOptions={debounce(loadOptions, 250)}
            components={components}
            {...commonProps}
          />
        </NoSsr>
      </div>
    )
  } else if (options) {
    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            TextFieldProps={{
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={options as any}
            components={components}
            {...commonProps}
          />
        </NoSsr>
      </div>
    )
  } else {
    throw new Error('One of props.options and props.loadOptions is required.')
  }
}

export default MaterialSelect
