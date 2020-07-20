import React from 'react'
import Markdown from 'markdown-to-jsx'
import { Paper, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    padding: spacing(2),
    margin: spacing(2),
  },
}))

function AboutView() {
  const classes = useStyles()
  const md = `
  # 关于我们

  \`RAP2\`是在\`RAP1\`基础上重做的新项目，它能给你提供方便的接口文档管理、Mock、导出等功能，包含两个组件(对应两个 Github Repository)。

  目前RAP2由\`阿里妈妈前端团队\`研发，由多个合作团队（包括开源社区）在维护。详请请见GitHub贡献者列表。

  GitHub仓库：

  rap2-delos: 后端服务器仓库 [link](http://github.com/thx/rap2-delos)

  rap2-dolores: 前端 React 项目仓库 [link](http://github.com/thx/rap2-dolores)

  相关开源、部署建议，请关注GitHub仓库首页README

  同时欢迎您前往 [GitHub Issues](https://github.com/thx/rap2-delos/issues) 提出宝贵意见!

  钉钉群：11789704

  `
  return (
    <Paper className={classes.root}>
      <Markdown>{md}</Markdown>
    </Paper>
  )
}

export default AboutView
