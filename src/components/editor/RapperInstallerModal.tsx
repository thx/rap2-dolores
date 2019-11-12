import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import config from '../../config'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions'
import { DialogContent } from '@material-ui/core'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import { Repository } from 'actions/types'

// import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco'
// import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'

// SyntaxHighlighter.registerLanguage('bash', bash)

type RapperType = 'requester' | 'redux'

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: spacing(2),
      flex: 1,
    },
    btn: {
      marginBottom: spacing(2),
      marginTop: spacing(2),
    },
    content: {
      width: '70vw',
      margin: '0 auto',
      paddingTop: 30,
    },
    formControl: {
      margin: spacing(3),
    },
  })
)

const Transition = React.forwardRef<unknown, TransitionProps>((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />
})

// /** 同步 rap 接口到本地 */
// const { rapper } = require('@ali/rapper');
// const { resolve } = require('path');

// rapper({
//   /** 生成的请求类型 */
//   type: 'requester',
//   /** 必须配置，rap 仓库 id */
//   projectId: ${projectId},
//   /** 可选，输出文件的目录，默认是 ./src/rapper/ */
//   rapperPath: resolve(process.cwd(), './src/rapper/'),
//   /** 可选，rap 前端地址，默认是 http://rap2.taobao.org */
//   rapUrl: '${window.location.origin}',
//   /** 可选，rap 后端 api 地址，默认是 http://rap2api.taobao.org */
//   apiUrl: '${config.serve}/repository/get?id=${projectId}'
//   /** 可选，输出模板代码的格式，具体见 prettier的配置规则 https://prettier.io/docs/en/options.html */
//   codeStyle: {
//     /** 默认单引号 */
//     singleQuote: true,
//     /** 默认2个空格 */
//     tabWidth: 2,
//     /** 分号结尾，默认false */
//     semi: false,
//     /** 逗号 */
//     trailingComma: 'es5',
//   },
// });
const codeTmpl = ({ projectId, token, rapperType }: {
  projectId: number
  token: string
  rapperType: RapperType
}) => {
  const apiUrl = `${config.serve}/repository/get?id=${projectId}&token=${token}`
  const rapUrl = window.location.origin
  return `npx rap --type ${rapperType} --apiUrl ${apiUrl} --rapUrl ${rapUrl}`
}

function RapperInstallerModal({
  open,
  handleClose,
  repository,
}: {
  open: boolean;
  handleClose: () => void;
  repository: Repository;
}) {
  const classes = useStyles()

  const [rapperType, setRapperType] = useState<RapperType>('requester')

  function handleRapperTypeChange(_event: React.ChangeEvent<HTMLInputElement>, value: RapperType) {
    setRapperType(value)
  }

  return (
    <Dialog
      fullScreen={true}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            配置 Rapper 帮你生成代码
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.content}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">生成代码的形式</FormLabel>
          <RadioGroup aria-label="rapperType" row={true} name="rapperType" value={rapperType} onChange={handleRapperTypeChange}>
            <FormControlLabel value="requester" control={<Radio />} label="请求函数" />
            <FormControlLabel value="redux" control={<Radio />} label="React/Redux 集成" />
          </RadioGroup>
        </FormControl>
        <pre>
          {codeTmpl({ projectId: repository.id, token: repository.token, rapperType })}
        </pre>
      </DialogContent>
    </Dialog>
  )
}

export default RapperInstallerModal
