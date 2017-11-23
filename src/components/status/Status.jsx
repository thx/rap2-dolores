import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RChart } from '../utils/'
import './Status.css'

// TODO 2.3 仓库曲线 接口曲线
// TODO 2.3 接口覆盖率
// TODO 2.3 接口调用（模拟）曲线
// TODO 2.3 用户曲线

class Status extends Component {
  static adapt (list, label) {
    return {
      labels: list.map(item => item.label),
      datasets: [{
        label: label || '-',
        data: list.map(item => item.value),
        backgroundColor: RChart.COLORS.blue,
        borderColor: RChart.COLORS.blue,
        borderWidth: 1,
        fill: false
      }]
    }
  }
  render () {
    let { counter, users, organizations, repositories, interfaces } = this.props
    let { analyticsRepositoriesCreated, analyticsRepositoriesUpdated, analyticsUsersActivation, analyticsRepositoriesActivation } = this.props
    // analyticsRepositoriesCreated = analyticsRepositoriesCreated.map((item, index, array) => ({
    //   label: item.label,
    //   value: array.slice(0, index + 1).reduce((sum, item) => {
    //     return sum + item.value
    //   }, 0)
    // })) // 不需要累积
    analyticsUsersActivation = analyticsUsersActivation.map(item => ({
      label: item.fullname || item.empId || item.userId,
      value: item.value
    }))
    analyticsRepositoriesActivation = analyticsRepositoriesActivation.map(item => ({
      label: item.name || item.repositoryId,
      value: item.value
    }))
    let dict = [
      ['版本', counter.version, ''],
      ['用户', users.pagination.total, '人'],
      ['模拟', counter.mock, '次'],
      ['团队', organizations.pagination.total, '个'],
      ['仓库', repositories.pagination.total, '个'],
      ['接口', interfaces.pagination.total, '个']
    ]
    return (
      <article className='Status'>
        {/* <div className='header'><span className='title'>分析和报告</span></div> */}
        <div className='body'>
          <div className='row mb20'>
            {dict.map(([name, value, unit]) =>
              <div key={name} className='col-12 col-sm-6 col-md-4 col-lg-2'>
                <div className='card'>
                  <div className='card-block'>
                    <div className='card-title name'>{name}</div>
                    <div>
                      <span className='value techfont'>{value}</span>
                      <span className='unit'>{unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className='row'>
            <div className='col-12 col-sm-12 col-md-12 col-lg-6 chart'>
              <div className='header'><span className='title'>最近 30 天新建仓库数</span></div>
              <RChart type='line' data={Status.adapt(analyticsRepositoriesCreated, '新建仓库数')} options={{}} />
            </div>
            <div className='col-12 col-sm-12 col-md-12 col-lg-6 chart'>
              <div className='header'><span className='title'>最近 30 天活跃仓库数</span></div>
              <RChart type='line' data={Status.adapt(analyticsRepositoriesUpdated, '活跃仓库数')} options={{}} />
            </div>
            <div className='col-12 col-sm-12 col-md-12 col-lg-6 chart'>
              <div className='header'><span className='title'>最近 30 天活跃用户排行</span></div>
              <RChart type='horizontalBar' data={Status.adapt(analyticsUsersActivation, '操作')} options={{}} />
            </div>
            <div className='col-12 col-sm-12 col-md-12 col-lg-6 chart'>
              <div className='header'><span className='title'>最近 30 天活跃仓库排行</span></div>
              <RChart type='horizontalBar' data={Status.adapt(analyticsRepositoriesActivation, '操作')} options={{}} />
            </div>
          </div>
        </div>
      </article>
    )
  }
}

const mapStateToProps = (state) => ({
  counter: state.counter,
  users: state.users,
  organizations: state.organizations,
  repositories: state.repositories,
  interfaces: state.interfaces,
  analyticsRepositoriesCreated: state.analyticsRepositoriesCreated.data,
  analyticsRepositoriesUpdated: state.analyticsRepositoriesUpdated.data,
  analyticsUsersActivation: state.analyticsUsersActivation.data,
  analyticsRepositoriesActivation: state.analyticsRepositoriesActivation.data
})
const mapDispatchToProps = ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status)
