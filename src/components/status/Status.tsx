import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RChart } from '../utils/'
import './Status.css'
import { Card } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

// TODO 2.3 仓库曲线 接口曲线
// TODO 2.3 接口覆盖率
// TODO 2.3 接口调用（模拟）曲线
// TODO 2.3 用户曲线

class Status extends Component<any, any> {
  adapt(list: any, label: any) {
    const theme = this.props.theme
    const mainColor = theme.palette.primary.main
    return {
      labels: list.map((item: any) => item.label),
      datasets: [{
        label: label || '-',
        data: list.map((item: any) => item.value),
        backgroundColor: mainColor,
        borderColor: mainColor,
        borderWidth: 1,
        fill: false,
      }],
    }
  }
  render() {
    const { counter, users, organizations, repositories, interfaces } = this.props
    let { analyticsUsersActivation, analyticsRepositoriesActivation } = this.props
    const { analyticsRepositoriesCreated, analyticsRepositoriesUpdated } = this.props
    // analyticsRepositoriesCreated = analyticsRepositoriesCreated.map((item, index, array) => ({
    //   label: item.label,
    //   value: array.slice(0, index + 1).reduce((sum, item) => {
    //     return sum + item.value
    //   }, 0)
    // })) // 不需要累积
    analyticsUsersActivation = analyticsUsersActivation.map((item: any) => ({
      label: item.fullname || item.empId || item.userId,
      value: item.value,
    }))
    analyticsRepositoriesActivation = analyticsRepositoriesActivation.map((item: any) => ({
      label: item.name || item.repositoryId,
      value: item.value,
    }))
    const dict = [
      ['版本', counter.version, ''],
      ['用户', users.pagination.total, '人'],
      ['模拟', counter.mock, '次'],
      ['团队', organizations.pagination.total, '个'],
      ['仓库', repositories.pagination.total, '个'],
      ['接口', interfaces.pagination.total, '个'],
    ]
    return (
      <article className="Status">
        {/* <div className='header'><span className='title'>分析和报告</span></div> */}
        <div className="body">
          <div className="row mb20">
            {dict.map(([name, value, unit]) =>
              <div key={name}>
                <Card className="card">
                  <div className="card-block">
                    <div className="card-title name">{name}</div>
                    <div>
                      <span className="value techfont">{value}</span>
                      <span className="unit">{unit}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
          <div className="row">
            <Card className="chart">
              <div className="header"><span className="title">最近 30 天新建仓库数</span></div>
              <RChart type="line" data={this.adapt(analyticsRepositoriesCreated, '新建仓库数')} options={{}} />
            </Card>
            <Card className="chart">
              <div className="header"><span className="title">最近 30 天活跃仓库数</span></div>
              <RChart type="line" data={this.adapt(analyticsRepositoriesUpdated, '活跃仓库数')} options={{}} />
            </Card>
            <Card className="chart">
              <div className="header"><span className="title">最近 30 天活跃用户排行</span></div>
              <RChart type="horizontalBar" data={this.adapt(analyticsUsersActivation, '操作')} options={{}} />
            </Card>
            <Card className="chart">
              <div className="header"><span className="title">最近 30 天活跃仓库排行</span></div>
              <RChart type="horizontalBar" data={this.adapt(analyticsRepositoriesActivation, '操作')} options={{}} />
            </Card>
          </div>
        </div>
      </article>
    )
  }
}

const mapStateToProps = (state: any) => ({
  counter: state.counter,
  users: state.users,
  organizations: state.organizations,
  repositories: state.repositories,
  interfaces: state.interfaces,
  analyticsRepositoriesCreated: state.analyticsRepositoriesCreated.data,
  analyticsRepositoriesUpdated: state.analyticsRepositoriesUpdated.data,
  analyticsUsersActivation: state.analyticsUsersActivation.data,
  analyticsRepositoriesActivation: state.analyticsRepositoriesActivation.data,
})
const mapDispatchToProps = ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Status))
