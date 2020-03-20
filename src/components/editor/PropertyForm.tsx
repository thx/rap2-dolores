import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Mock from 'mockjs'
import SmartTextarea from '../utils/SmartTextarea'
import { Button } from '@material-ui/core'
import { TYPES } from '../../utils/consts'

// 模拟数据
export const mockProperty = process.env.NODE_ENV === 'development'
  ? () => Mock.mock({
    'scope|1': ['request', 'response'],
    name: '@WORD(6)',
    'type|1': ['String', 'Number', 'Boolean'],
    'value|1': ['@INT', '@FLOAT', '@TITLE', '@NAME'],
    description: '@CSENTENCE',
    parentId: -1,
    interfaceId: '@NATURAL',
    moduleId: '@NATURAL',
    repositoryId: '@NATURAL',
  })
  : () => ({
    scope: 'response',
    name: '',
    type: 'String',
    value: '',
    description: '',
    parentId: -1,
    interfaceId: undefined,
    moduleId: undefined,
    repositoryId: undefined,
  })

class PropertyForm extends Component<any, any> {
  static propTypes = {
    scope: PropTypes.string.isRequired,
    parent: PropTypes.object,
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object.isRequired,
    interfaceId: PropTypes.number.isRequired,
  }
  static contextTypes = {
    rmodal: PropTypes.instanceOf(Component),
    handleAddMemoryProperty: PropTypes.func.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = mockProperty()
  }
  render() {
    const { rmodal } = this.context
    return (
      <section>
        <div className="rmodal-header">
          <span className="rmodal-title">{this.props.title}</span>
        </div>
        <form className="form-horizontal w600" onSubmit={this.handleSubmit}>
          <div className="rmodal-body">
            <div className="form-group row" style={{}}>
              <label className="col-sm-2 control-label">名称：</label>
              <div className="col-sm-10">
                <input
                  name="name"
                  tabIndex={1}
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                  className="form-control"
                  placeholder="Name"
                  spellCheck={false}
                  autoFocus={true}
                  required={true}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 control-label">类型：</label>
              <div className="col-sm-10">
                <select
                  name="type"
                  tabIndex={2}
                  value={this.state.type}
                  onChange={e => {
                    const type = e.target.value
                    if (type === 'Null') {
                      this.setState({ value: '' })
                    }
                    this.setState({ type })
                  }}
                  className="form-control"
                >
                  {TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 control-label">生成规则：</label>
              <div className="col-sm-10">
                <input
                  name="rule"
                  tabIndex={3}
                  value={this.state.rule}
                  onChange={e => this.setState({ rule: e.target.value })}
                  className="form-control"
                  placeholder="Rule"
                  spellCheck={false}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 control-label">初始值：</label>
              <div className="col-sm-10">
                <input
                  name="value"
                  tabIndex={4}
                  value={this.state.value}
                  onChange={e => this.setState({ value: e.target.value })}
                  className="form-control"
                  placeholder="Value"
                  spellCheck={false}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 control-label">简介：</label>
              <div className="col-sm-10">
                <SmartTextarea
                  tabIndex={5}
                  name="description"
                  value={this.state.description}
                  onChange={(e: any) => this.setState({ description: e.target.value })}
                  className="form-control"
                  placeholder="Description"
                  spellCheck={false}
                  rows="5"
                />
              </div>
            </div>
          </div>
          <div className="rmodal-footer">
            <div className="form-group row mb0">
              <label className="col-sm-2 control-label" />
              <div className="col-sm-10">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginRight: 8 }}
                >
                  提交
                </Button>
                <Button onClick={() => rmodal.close()}>取消</Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    )
  }
  componentDidUpdate() {
    this.context.rmodal.reposition()
  }
  handleSubmit = (e: any) => {
    e.preventDefault()
    const { auth, repository, mod, interfaceId, scope, parent = { id: -1 } } = this.props
    const { handleAddMemoryProperty } = this.context
    const property = Object.assign({}, this.state, {
      creatorId: auth.id,
      repositoryId: repository.id,
      moduleId: mod.id,
      interfaceId,
      scope,
      parentId: parent.id,
    })
    handleAddMemoryProperty(property, () => {
      const { rmodal } = this.context
      if (rmodal) {
        rmodal.resolve()
      }
    })
  }
}

const mapStateToProps = (state: any) => ({
  auth: state.auth,
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyForm)
