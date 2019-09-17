import React from 'react'
import { serve } from '../../relatives/services/constant'
import './API.css'
import { Paper, Button } from '@material-ui/core'

const ExampleJQuery = () => (
  <div>
    <ul>
      <li>先引入jQuery插件</li>
      <li>再引入基础插件</li>
      <li>最后引入RAP jQuery插件</li>
    </ul>
    <h4>示例代码</h4>
    <pre className="code-example">
      {
        '<script src="jquery.min.js"></script>\n' +
        '<script src="http://rap2api.taobao.org/app/plugin/:projectId"></script>\n' +
        '<script src="http://rap2api.taobao.org/libs/jquery.rap.js"></script>\n' +
        '$.ajax({\n' +
        '    url : \'/example/1501049256513\', // 自动拦截\n' +
        '    method : \'GET\',\n' +
        '    dataType : \'JSON\',\n' +
        '    success : function(data) {\n' +
        '      // 返回根据RAP文档及规则生成的mock数据\n' +
        '      $(\'#result\').html(JSON.stringify(data))\n' +
        '    }\n' +
        '})\n'
      }
    </pre>
  </div>
)

// DONE 2.3 区分请求和响应作用域

type State = {
  showExampleJQuery: boolean;
}

type Props = any

class API extends React.Component<Props, State> {

  constructor(props: any) {
    super(props)
    this.state = {
      showExampleJQuery: false,
    }
  }
  render() {
    return (
      <Paper className="APIList">
        <div className="header">
          <span className="title">用户手册</span>
        </div>
        <div className="body">
          <div className="API">
            <ul>
              <li>
                <a href="https://github.com/thx/rap2-delos/wiki">https://github.com/thx/rap2-delos/wiki</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="header">
          <span className="title">平台API接口</span>
        </div>
        <div className="body">
          <div className="API">
            <div className="title">获取仓库的完整数据（JSON）</div>
            <ul>
              <li><code>{serve}/repository/get?id=:repositoryId</code></li>
            </ul>
          </div>
          <div className="API">
            <div className="title">获取接口的完整数据（JSON）</div>
            <ul>
              <li><code>{serve}/interface/get?id=:interfaceId</code></li>
            </ul>
          </div>
          <div className="API">
            <div className="title">获取仓库的前端插件（JS）</div>
            <ul>
              <li><span className="label">基础插件</span><code>{serve}/app/plugin/:repositories</code></li>
              <li><span className="label">jQuery 插件</span><code>{serve}/libs/jquery.rap.js</code>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={
                    e => {
                      e.preventDefault()
                      this.setState((prevState) => {
                        return { showExampleJQuery: !prevState.showExampleJQuery }
                      })
                    }
                  }
                >
                  用法
                </Button>
              </li>
              {this.state.showExampleJQuery && <ExampleJQuery />}
              <li><span className="label">Mock.js 插件</span><code>{serve}/libs/mock.rap.js</code></li>
              <li><span className="label">fetch 插件</span><code>{serve}/libs/fetch.rap.js</code></li>
            </ul>
          </div>
          <div className="API">
            <div className="title">获取单个接口的数据（JSON）</div>
            <ul>
              <li>
                <code>{serve}/app/mock/data/:interfaceId?scope=response|request</code>
                <table className="table table-bordered mt12">
                  <thead>
                    <tr>
                      <th style={{ width: '140px' }}><code>scope</code></th>
                      <th>描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>response</code></td>
                      <td>获取单个接口的响应数据（JSON）</td>
                    </tr>
                    <tr>
                      <td><code>request</code></td>
                      <td>获取单个接口的请求数据（JSON）</td>
                    </tr>
                  </tbody>
                </table>
              </li>
              <li><code>{serve}/app/mock/:repositoryId/:method/:url</code></li>
            </ul>
          </div>
          <div className="API">
            <div className="title">获取单个接口的模板（JSON）</div>
            <ul>
              <li>
                <code>{serve}/app/mock/template/:interfaceId?scope=response|request</code>
                <table className="table table-bordered mt12">
                  <thead>
                    <tr>
                      <th style={{ width: '120px' }}><code>scope</code></th>
                      <th>描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>response</code></td>
                      <td>获取单个接口的响应模板（JSON）</td>
                    </tr>
                    <tr>
                      <td><code>request</code></td>
                      <td>获取单个接口的请求模板（JSON）</td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>
          <div className="API">
            <div className="title">获取单个接口的模板（JSON Schema）</div>
            <ul>
              <li>
                <code>{serve}/app/mock/schema/:interfaceId?scope=response|request</code>
                <table className="table table-bordered mt12">
                  <thead>
                    <tr>
                      <th style={{ width: '120px' }}><code>scope</code></th>
                      <th>描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>response</code></td>
                      <td>获取单个接口的响应模板（JSON Schema）</td>
                    </tr>
                    <tr>
                      <td><code>request</code></td>
                      <td>获取单个接口的请求模板（JSON Schema）</td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>
        </div>
      </Paper>
    )
  }
}

export default API
