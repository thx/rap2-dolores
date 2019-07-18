import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RadioList from '../utils/RadioList'
import './ImportRepositoryForm.css'
import { importRepository, fetchRepositoryList } from '../../actions/repository'
import { Button } from '@material-ui/core'

class ImportRepositoryForm extends Component<any, any> {
  static contextTypes = {
    rmodal: PropTypes.object.isRequired,
  }
  static propTypes = {
    orgId: PropTypes.number.isRequired,
    importRepository: PropTypes.func.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = {
      orgId: props.orgId,
      version: 1,
      docUrl: '',
      disableSubmit: false,
    }
  }
  render() {
    const { rmodal } = this.context
    const { disableSubmit } = this.state
    return (
      <section className="ImportRepositoryForm">
        <div className="rmodal-header">
          <span className="rmodal-title">{this.props.title}</span>
        </div>
        <form className="form-horizontal" onSubmit={this.handleSubmit} >
          <div className="rmodal-body">
            <div className="form-group row">
              <label className="col-sm-2 control-label">版本</label>
              <div className="col-sm-10">
                <RadioList
                  data={[{ 'label': 'RAP1', 'value': 1 }]}
                  curVal={this.state.version}
                  name="version"
                  disabled={true}
                />
              </div>
            </div>
            <div>
              <div className="form-group row">
                <label className="col-sm-2 control-label">文档URL</label>
                <div className="col-sm-10">
                  <input
                    name="projectId"
                    value={this.state.docUrl}
                    onChange={e => this.setState({ docUrl: e.target.value })}
                    className="form-control"
                    placeholder="http://rapapi.org/workspace/myWorkspace.do?projectId=145#2548"
                    spellCheck={false}
                    autoFocus={true}
                    required={true}
                    data-parsley-maxlength="256"
                  />
                </div>
              </div>
              <div className="form-group row mb0">
                <label className="col-sm-2 control-label" />
                <div className="col-sm-10">
                  <Button
                    type="submit"
                    id="btnSubmitImportRAP"
                    disabled={disableSubmit}
                    variant="contained"
                    color="primary"
                    style={{ marginRight: 8 }}
                  >{disableSubmit ? '导入中，请稍等...' : '提交'}
                  </Button>
                  <Button onClick={() => rmodal.close()}>取消</Button>
                </div>
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
    this.setState({
      disableSubmit: true,
    })
    e.preventDefault()
    const { docUrl, orgId } = this.state
    this.props.importRepository({ docUrl, orgId }, (res: any) => {
      this.setState({
        disableSubmit: false,
      })
      if (res.isOk) {
        this.context.rmodal.resolve()
      } else {
        console.log(res.message)
      }
    })
  }
}

const mapDispatchToProps = ({
  importRepository,
  fetchRepositoryList,
})

export default connect(
  null,
  mapDispatchToProps
)(ImportRepositoryForm)
