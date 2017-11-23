import React, { Component } from 'react'
import { PropTypes, connect } from '../../family'
import Organization from './Organization'

// 展示组件
class OrganizationList extends Component {
  // DONE 2.1 补全 propTypes
  static propTypes = {
    name: PropTypes.string,
    organizations: PropTypes.array.isRequired
  }
  render () {
    let { name, organizations } = this.props
    if (!organizations.length) {
      return name
        ? <div className='fontsize-14 text-center p40'>没有找到匹配 <strong>{name}</strong> 的团队。</div>
        : <div className='fontsize-14 text-center p40'>没有数据。</div>
    }
    return (
      <div className='OrganizationList'>
        {organizations.map(organization =>
          <Organization key={organization.id} organization={organization} />
        )}
      </div>
    )
  }
}

// 容器组件
const mapStateToProps = (state) => ({})
const mapDispatchToProps = ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationList)
