import React, { Component } from 'react'
import { PropTypes, connect, Link, Mock, _ } from '../../family'
import { RCodeMirror } from '../utils/'
import { addProperty } from '../../actions/property'

const mockResult = process.env.NODE_ENV === 'development'
  ? () => ({
    foo: {
      bar: {
        faz: {}
      }
    }
  })
  : () => ({})

class Importer extends Component {
  static contextTypes = {
    rmodal: PropTypes.instanceOf(Component),
    handleAddMemoryProperties: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      result: JSON.stringify(mockResult(), null, 2)
    }
  }
  render () {
    const { rmodal } = this.context
    return (
      <section className='Importer'>
        <div className='rmodal-header'>
          <span className='rmodal-title'>{this.props.title}</span>
          <Link to='' onClick={e => this.handleBeautify(e)}>格式化</Link>
        </div>
        <form className='form-horizontal w600' onSubmit={this.handleSubmit} >
          <div className='rmodal-body'>
            <div className='form-group'>
              {/* <SmartTextarea name='result' value={this.state.result} onChange={e => this.setState({ result: e.target.value })} className='form-control result' placeholder='Result' rows='20' /> */}
              {/* TODO 2.1 完善编辑器，完善什么？ */}
              <RCodeMirror value={this.state.result} onChange={value => this.setState({ result: value })} ref={$rcm => { this.$rcm = $rcm }} />
            </div>
          </div>
          <div className='rmodal-footer'>
            <div className='form-group mb0'>
              <button type='submit' className='btn btn-success w140 mr20'>提交</button>
              {/* 这里不应该用 Link，应该用 <a> 或者 fake-link */}
              <Link to='' onClick={e => { e.preventDefault(); rmodal.close() }} className='mr10'>取消</Link>
            </div>
          </div>
        </form>
      </section>
    )
  }
  componentDidUpdate () {
    this.context.rmodal.reposition()
  }
  // DONE 2.1 支持格式化
  handleBeautify = (e) => {
    e.preventDefault()
    if (this.$rcm) {
      let result = eval('(' + this.state.result + ')')  // eslint-disable-line no-eval
      let beautified = JSON.stringify(result, null, 2)
      this.$rcm.cm.setValue(beautified)
    }
  }
  // TODO 2.1 待完整测试各种输入
  // DONE 2.1 BUG 类型 Number，初始值 ''，被解析为随机字符串
  handleJSONSchema = (schema, parent = { id: -1 }, memoryProperties) => {
    if (!schema) return
    let { auth, repository, mod, itf, scope } = this.props

    // DONE 2.1 需要与 Mock 的 rule.type 规则统一，首字符小写，好烦！应该忽略大小写！
    let type = schema.type[0].toUpperCase() + schema.type.slice(1)
    let rule = ''
    if (type === 'Array' && schema.items && schema.items.length > 1) {
      rule = schema.items.length
    }
    let property = Object.assign({
      name: schema.name,
      type,
      rule,
      value: /Array|Object/.test(type) ? '' : schema.template,
      descripton: ''
    }, {
      creator: auth.id,
      repositoryId: repository.id,
      moduleId: mod.id,
      interfaceId: itf.id,
      scope,
      parentId: parent.id
    }, {
      memory: true,
      id: _.uniqueId('memory-')
    })
    memoryProperties.push(property)

    if (schema.properties) {
      schema.properties.forEach(item => this.handleJSONSchema(item, property, memoryProperties))
    }
    if (schema.items && schema.items[0] && schema.items[0].properties) {
      schema.items[0].properties.forEach(item => this.handleJSONSchema(item, property, memoryProperties))
    }
  }
  // DONE 2.1 因为 setState() 是异步的，导致重复调用 handleAddMemoryProperty() 时最后保留最后一个临时属性
  handleSubmit = (e) => {
    e.preventDefault()
    let result = eval('(' + this.state.result + ')')  // eslint-disable-line no-eval
    let schema = Mock.toJSONSchema(result)
    let memoryProperties = []
    if (schema.properties) schema.properties.forEach(item => this.handleJSONSchema(item, undefined, memoryProperties))

    let { handleAddMemoryProperties } = this.context
    handleAddMemoryProperties(memoryProperties, () => {
      // done
      let { rmodal } = this.context
      if (rmodal) rmodal.resolve()
    })
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})
const mapDispatchToProps = ({
  onAddProperty: addProperty
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Importer)
