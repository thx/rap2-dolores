import React, { Component } from 'react'
import { PropTypes, Link, Mock, _ } from '../../family'
import { Tree } from '../utils'
import { serve } from '../../relatives/services/constant'
import { GoLink, GoSync, GoBeer, GoBug } from 'react-icons/lib/go'
import { RE_KEY } from 'mockjs/src/mock/constant'

class Previewer extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    properties: PropTypes.array.isRequired,
    itf: PropTypes.object.isRequired
  }
  render () {
    let { label, scope, properties, itf } = this.props

    // DONE 2.2 支持引用请求参数
    let scopedProperties = {
      request: properties.map(property => ({ ...property })).filter(property => property.scope === 'request'),
      response: properties.map(property => ({ ...property })).filter(property => property.scope === 'response')
    }
    let scopedTemplate = {
      request: Tree.treeToJson(Tree.arrayToTree(scopedProperties.request)),
      response: Tree.treeToJson(Tree.arrayToTree(scopedProperties.response))
    }
    let scopedKeys = {
      request: Object.keys(scopedTemplate.request).map(item => item.replace(RE_KEY, '$1')),
      response: Object.keys(scopedTemplate.response).map(item => item.replace(RE_KEY, '$1'))
    }
    let extraKeys = _.difference(scopedKeys.request, scopedKeys.response)
    let scopedData = {
      request: Mock.mock(scopedTemplate.request)
    }
    scopedData.response = Mock.mock(
      Object.assign({}, _.pick(scopedData.request, extraKeys), scopedTemplate.response)
    )
    scopedData.response = _.pick(scopedData.response, scopedKeys.response)

    let template = scopedTemplate[scope]
    let data = scopedData[scope]

    // DONE 2.1 支持虚拟属性 __root__ √服务端 √前端 √迁移测试
    let keys = Object.keys(data)
    if (keys.length === 1 && keys[0] === '__root__') data = data.__root__

    let { Assert } = Mock.valid
    let valid = Mock.valid(template, data)
    for (var i = 0; i < valid.length; i++) {
      console.warn(Assert.message(valid[i]))
    }
    return (
      <div className='Previewer row'>
        <div className='result-template col-6'>
          <div className='header'>
            <span className='title'>{label}模板</span>
            {scope === 'response'
              ? <Link to={`${serve}/app/mock/template/${itf.id}`} target='_blank'><GoLink className='fontsize-14' /></Link>
              : null}
          </div>
          <pre className='body'>{
            JSON.stringify(template, (k, v) => {
              if (typeof v === 'function') return v.toString()
              if (v !== undefined && v !== null && v.exec) return v.toString()
              else return v
            }, 2)
          }</pre>
        </div>
        <div className='result-mocked col-6'>
          <div className='header'>
            <span className='title'>{label}数据</span>
            {scope === 'response'
              ? <Link to={`${serve}/app/mock/data/${itf.id}`} target='_blank'><GoLink className='mr6 fontsize-14' /></Link>
              : null}
            <Link to='' onClick={e => this.remock(e)}><GoSync className='mr6 fontsize-14' onAnimationEnd={e => this.removeAnimateClass(e)} /></Link>
          </div>
          <pre className='body'>{JSON.stringify(data, null, 2)}</pre>
        </div>
        {scope === 'response'
          ? <div className='result-valid col-12'>
            {!valid.length
              ? <span><GoBeer className='mr6 fontsize-20' />模板与数据匹配 √</span>
              : <span><GoBug className='mr6 fontsize-20' />模板与数据不匹配</span>
            }
          </div>
          : null
        }
      </div>
    )
  }
  remock = (e) => {
    e.preventDefault()
    let target = e.currentTarget.firstChild
    target.classList.add('animated')
    target.classList.add('rotateIn')
    this.forceUpdate()
  }
  removeAnimateClass = (e) => {
    let target = e.currentTarget
    target.classList.remove('animated')
    target.classList.remove('rotateIn')
  }
}

export default Previewer
