import React, { Component } from 'react'
import { PropTypes, Link, Mock, _ } from '../../family'
import { Tree } from '../utils'
import { serve } from '../../relatives/services/constant'
import { GoLink, GoSync, GoBeaker, GoBug } from 'react-icons/go'

/*eslint no-useless-escape: 0*/
const RE_KEY = /(.+)\|(?:\+(\d+)|([\+\-]?\d+-?[\+\-]?\d*)?(?:\.(\d+-?\d*))?)/

class Previewer extends Component<any, any> {
  static propTypes = {
    label: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    properties: PropTypes.array.isRequired,
    interfaceId: PropTypes.number.isRequired,
  }
  render() {
    let scopedTemplate
    let scopedProperties
    let scopedData: any
    let scopedKeys
    let extraKeys
    const { label, scope, properties, interfaceId } = this.props

    try {
      // DONE 2.2 支持引用请求参数
      scopedProperties = {
        request: properties
          .map((property: any) => ({ ...property }))
          .filter((property: any) => property.scope === 'request'),
        response: properties
          .map((property: any) => ({ ...property }))
          .filter((property: any) => property.scope === 'response'),
      }
      scopedTemplate = {
        request: Tree.treeToJson(Tree.arrayToTree(scopedProperties.request)),
        response: Tree.treeToJson(Tree.arrayToTree(scopedProperties.response)),
      }
      scopedKeys = {
        request: Object.keys(scopedTemplate.request).map(item => item.replace(RE_KEY, '$1')),
        response: Object.keys(scopedTemplate.response).map(item => item.replace(RE_KEY, '$1')),
      }
      extraKeys = _.difference(scopedKeys.request, scopedKeys.response)
      scopedData = {
        request: Mock.mock(scopedTemplate.request),
      }
      scopedData.response = Mock.mock(
        Object.assign({}, _.pick(scopedData.request, extraKeys), scopedTemplate.response),
      )
      scopedData.response = _.pick(scopedData.response, scopedKeys.response)

      const template = (scopedTemplate as any)[scope]
      let data = scopedData[scope]
      if (data.__root__) {
        data = data.__root__
      }

      // DONE 2.1 支持虚拟属性 __root__ √服务端 √前端 √迁移测试
      const keys = Object.keys(data)
      if (keys.length === 1 && keys[0] === '__root__') {
        data = data.__root__
      }

      const { Assert } = Mock.valid
      const valid = Mock.valid(template, data)
      for (const i of valid) {
        console.warn(Assert.message(i))
      }
      return (
        <div className="Previewer">
          <div className="result-template">
            <div className="header">
              <span className="title">{label}模板</span>
              {scope === 'response' ? (
                <a
                  href={`${serve}/app/mock/template/${interfaceId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GoLink className="fontsize-14" />
                </a>
              ) : null}
            </div>
            <pre className="body">
              {JSON.stringify(
                template,
                (_: any, v) => {
                  if (typeof v === 'function') {
                    return v.toString()
                  }
                  if (v !== undefined && v !== null && v.exec) {
                    return v.toString()
                  } else {
                    return v
                  }
                },
                2,
              )}
            </pre>
          </div>
          <div className="result-mocked">
            <div className="header">
              <span className="title">{label}数据</span>
              {scope === 'response' ? (
                <a
                  href={`${serve}/app/mock/data/${interfaceId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GoLink className="mr6 fontsize-14" />
                </a>
              ) : null}
              <Link to="" onClick={e => this.remock(e)}>
                <GoSync
                  className="mr6 fontsize-14"
                  onAnimationEnd={e => this.removeAnimateClass(e)}
                />
              </Link>
            </div>
            <pre className="body">{JSON.stringify(data, null, 2)}</pre>
          </div>
          {scope === 'response' ? (
            <div className="result-valid col-12">
              {!valid.length ? (
                <span>
                  <GoBeaker className="mr6 fontsize-20" />
                  模板与数据匹配 √
                </span>
              ) : (
                <span>
                  <GoBug className="mr6 fontsize-20" />
                  模板与数据不匹配
                </span>
              )}
            </div>
          ) : null}
        </div>
      )
    } catch (ex) {
      if (scopedData) {
        scopedData.response = `无法预览Mock数据，因为您编写规则导致如下错误：${ex.message}`
      }
    }
    return <div>发生错误...</div>
  }
  remock = (e: any) => {
    e.preventDefault()
    const target = e.currentTarget.firstChild
    target.classList.add('animated')
    target.classList.add('rotateIn')
    this.forceUpdate()
  }
  removeAnimateClass = (e: any) => {
    const target = e.currentTarget
    target.classList.remove('animated')
    target.classList.remove('rotateIn')
  }
}

export default Previewer
