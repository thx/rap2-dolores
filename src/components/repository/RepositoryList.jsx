import React, { Component } from 'react'
import { PropTypes } from '../../family'
import Repository from './Repository'

class RepositoryList extends Component {
  static propTypes = {
    name: PropTypes.string, // 搜索仓库
    repositories: PropTypes.array.isRequired, // 仓库列表
    editor: PropTypes.string.isRequired // 仓库编辑器地址
  }
  render () {
    let { name, repositories, editor } = this.props
    if (!repositories.length) {
      return name
        ? <div className='fontsize-14 text-center p40'>没有找到匹配 <strong>{name}</strong> 的仓库。</div>
        : <div className='fontsize-14 text-center p40'>没有数据。</div>
    }
    return (
      <div className='RepositoryList row'>
        {repositories.map(repository =>
          <div key={repository.id} className='col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3'>
            <Repository repository={repository} editor={editor} />
          </div>
        )}
      </div>
    )
  }
}

export default RepositoryList
