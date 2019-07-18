import React from 'react'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './nprogress.css'
import MainMenu from 'components/layout/MainMenu'
const Header = ({ fetching, user = {} }: any) => {
  if (!user || !user.id) {
    return null
  }
  document.body.style.cursor = fetching ? 'wait' : 'default' // TODO 2.3 应该有更好的方式监听整个 APP 是否有未完成的请求！
  fetching ? NProgress.start() : NProgress.done()
  return (
    <section className="Header">
      <nav className="clearfix">
        <MainMenu user={user} />
      </nav>
    </section>
  )
}

const mapStateToProps = (state: any) => ({
  fetching: (() => {
    let fetching = 0
    for (const key in state) {
      if (state[key] && state[key].fetching) { fetching += 1 }
    }
    return fetching
  })(), // state.fetching
  user: state.auth,
})

const mapDispatchToProps = ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
