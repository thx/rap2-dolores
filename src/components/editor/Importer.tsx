import React, { Component } from 'react'
import { connect, Link, Mock, _, PropTypes } from '../../family'
import { RCodeMirror } from '../utils/'
import { addProperty } from '../../actions/property'
import { RootState } from 'actions/types'
import { Button } from '@material-ui/core'
const mockResult =
  process.env.NODE_ENV === 'development'
    ? () => ({
      foo: {
        bar: {
          faz: {},
        },
      },
    })
    : () => ({})
function isPrimitiveType(type: string) {
  return ['number', 'null', 'undefined', 'boolean', 'string'].indexOf(type.toLowerCase()) > -1
}
const isIncreamentNumberSequence = (numbers: any) =>
  numbers.every((num: any) => typeof num === 'number' && ((num: any, i: number) => i === 0 || num - numbers[i - 1] === 1))
function mixItemsProperties(items: any) {
  // 合并 item properties 的 key，返回的 item 拥有导入 json 的所有 key
  if (!items || !items.length) {
    return {
      properties: [],
    }
  } else if (items.length === 1) {
    if (!items[0].properties) {
      items[0].properties = []
    }
    return items[0]
  } else {
    const baseItem = items[0]
    if (!baseItem.properties) {
      baseItem.properties = []
    }
    const baseProperties = baseItem.properties
    for (let i = 1; i < items.length; ++i) {
      const item = items[i]
      if (item.properties && item.properties.length) {
        for (const p of item.properties) {
          if (!baseProperties.find((e: any) => e.name === p.name)) {
            baseProperties.push(p)
          }
        }
      }
    }
    return baseItem
  }
}
type ImporterProps = {
  rmodal?: any,
  title?: any,
  handleAddMemoryProperties: (...args: any[]) => any,
  [k: string]: any;
}
type ImporterState = {
  result: string
}
class Importer extends Component<ImporterProps, ImporterState> {
  static contextTypes = {
    rmodal: PropTypes.object.isRequired,
    handleAddMemoryProperties: PropTypes.func.isRequired,
  }
  $rcm: any
  constructor(props: any) {
    super(props)
    this.state = {
      result: JSON.stringify(mockResult(), null, 2),
    }
  }
  render() {
    const { rmodal } = this.context
    return (
      <section className="Importer">
        <div className="rmodal-header">
          <span className="rmodal-title">{this.props.title}</span>
          <Link to="" onClick={e => this.handleBeautify(e)}>
            格式化
          </Link>
        </div>
        <form className="form-horizontal w600" onSubmit={this.handleSubmit}>
          <div className="rmodal-body">
            <div className="form-group">
              <RCodeMirror
                value={this.state.result}
                onChange={(value: any) => this.setState({ result: value })}
                ref={$rcm => {
                  this.$rcm = $rcm
                }}
              />
            </div>
          </div>
          <div className="rmodal-footer">
            <div className="form-group mb0">
              <Button type="submit" style={{ marginRight: 8 }} variant="contained" color="primary">
                提交
              </Button>
              <Button onClick={() => rmodal.close()} > 取消 </Button>
            </div>
          </div>
        </form>
      </section>
    )
  }
  componentDidUpdate() {
    this.context.rmodal.reposition()
  }
  // DONE 2.1 支持格式化
  handleBeautify = (e: any) => {
    e.preventDefault()
    if (this.$rcm) {
      const result = eval('(' + this.state.result + ')') // eslint-disable-line no-eval
      const beautified = JSON.stringify(result, null, 2)
      this.$rcm.cm.setValue(beautified)
    }
  };
  // TODO 2.1 待完整测试各种输入
  // DONE 2.1 BUG 类型 Number，初始值 ''，被解析为随机字符串
  handleJSONSchema = (schema: any, parent = { id: '-1' }, memoryProperties: any, siblings?: any) => {
    if (!schema) { return }
    const { auth, repository, mod, itf, scope } = this.props
    const hasSiblings = siblings instanceof Array && siblings.length > 0
    // DONE 2.1 需要与 Mock 的 rule.type 规则统一，首字符小写，好烦！应该忽略大小写！
    let type = schema.type[0].toUpperCase() + schema.type.slice(1)
    let rule = ''
    if (type === 'Array' && schema.items && schema.items.length > 1) {
      rule = schema.items.length
    }
    let value = /Array|Object/.test(type) ? '' : schema.template
    if (schema.items && schema.items.length) {
      const childType = schema.items[0].type
      if (isPrimitiveType(childType)) {
        value = JSON.stringify(schema.template)
        rule = ''
      }
    } else if (hasSiblings && isPrimitiveType(type)) {
      // 如果是简单数据可以在这里进行合并
      const valueArr = siblings.map((s: any) => s && s.template)
      if (_.uniq(valueArr).length > 1) {
        // 只有在数组里有不同元素时再合并
        if (isIncreamentNumberSequence(valueArr)) {
          // 如果是递增数字序列特殊处理
          value = valueArr[0]
          rule = '+1'
        } else {
          // 比如 [{a:1},{a:2}]
          // 我们可以用 type: Array rule: +1 value: [1,2] 进行还原
          value = JSON.stringify(valueArr)
          type = 'Array'
          rule = '+1'
        }
      }
    }
    const property = Object.assign(
      {
        name: schema.name,
        type,
        rule,
        value,
        descripton: '',
      },
      {
        creator: auth.id,
        repositoryId: repository.id,
        moduleId: mod.id,
        interfaceId: itf.id,
        scope,
        parentId: parent.id,
      },
      {
        memory: true,
        id: _.uniqueId('memory-'),
      }
    )
    memoryProperties.push(property)
    if (schema.properties) {
      schema.properties.forEach((item: any) => {
        const childSiblings = hasSiblings ? siblings.map((s: any) => s && (s.properties.find((p: any) => p.name === item.name) || null)) : undefined
        this.handleJSONSchema(item, property, memoryProperties, childSiblings)
      })
    }
    mixItemsProperties(schema.items).properties.forEach((item: any) => {
      const siblings = schema.items.map((o: any) => o.properties.find((p: any) => p.name === item.name) || null)
      this.handleJSONSchema(item, property, memoryProperties, siblings)
    })
  };
  // DONE 2.1 因为 setState() 是异步的，导致重复调用 handleAddMemoryProperty() 时最后保留最后一个临时属性
  handleSubmit = (e: any) => {
    e.preventDefault()
    let result = eval('(' + this.state.result + ')') // eslint-disable-line no-eval
    if (result instanceof Array) {
      result = { _root_: result }
    }
    const schema = Mock.toJSONSchema(result)
    const memoryProperties: any = []
    if (schema.properties) { schema.properties.forEach((item: any) => this.handleJSONSchema(item, undefined, memoryProperties)) }
    const { handleAddMemoryProperties } = this.context
    handleAddMemoryProperties(memoryProperties, () => {
      // done
      const { rmodal } = this.context
      if (rmodal) { rmodal.resolve() }
    })
  };
}
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
})
const mapDispatchToProps = {
  onAddProperty: addProperty,
}
export default connect(mapStateToProps, mapDispatchToProps)(Importer)
