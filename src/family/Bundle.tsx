// https://reacttraining.com/react-router/web/guides/code-splitting
import { Component } from 'react'

class Bundle extends Component<any, any> {
  state = {
    // short for "module" but that's a keyword in js, so "mod"
    mod: null,
  }

  componentWillMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props: any) {
    this.setState({
      mod: null,
    })
    props.load((mod: any) => {
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod,
      })
    })
  }

  render() {
    // @ts-ignore
    return this.props.children(this.state.mod)
  }
}

export default Bundle
