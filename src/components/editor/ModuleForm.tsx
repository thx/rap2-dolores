import React, { Component } from 'react'
import { PropTypes, connect, Mock } from '../../family'
import { SmartTextarea } from '../utils'
import { RootState } from 'actions/types'
import { Button } from '@material-ui/core'
// 模拟数据
const mockModule = process.env.NODE_ENV === 'development'
  ? () => Mock.mock({
    name: '模块@CTITLE(4)',
    description: '@CPARAGRAPH',
    repositoryId: undefined,
  })
  : () => ({
    name: '',
    description: '',
    repositoryId: undefined,
  })

// 展示组件
class ModuleForm extends Component<any, any> {
  static contextTypes = {
    rmodal: PropTypes.object.isRequired,
    onAddModule: PropTypes.func.isRequired,
    onUpdateModule: PropTypes.func.isRequired,
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    repository: PropTypes.object.isRequired,
    mod: PropTypes.object,
  }
  constructor(props: any) {
    super(props)
    const { mod } = this.props
    this.state = mod ? { ...mod } : mockModule()
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
            <div className="form-group row">
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
              <label className="col-sm-2 control-label">简介：</label>
              <div className="col-sm-10">
                <SmartTextarea
                  tabIndex={2}
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
                <Button type="submit" style={{ marginRight: 8 }} variant="contained" color="primary">提交</Button>
                <Button onClick={() => rmodal.close()} >取消</Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    )
  }
  handleSubmit = (e: any) => {
    e.preventDefault()
    const { onAddModule, onUpdateModule } = this.context
    const { auth, repository } = this.props
    const onAddOrUpdateModule = this.state.id ? onUpdateModule : onAddModule
    const mod = Object.assign({}, this.state, {
      creatorId: auth.id,
      repositoryId: repository.id,
    })
    const { rmodal } = this.context
    rmodal.close()
    onAddOrUpdateModule(mod, () => {
      if (rmodal) { rmodal.resolve() }
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleForm)
