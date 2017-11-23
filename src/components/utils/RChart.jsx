import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Chart from 'chart.js'

class RChart extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    width: PropTypes.string, // TODO 非必须，有默认值 16
    height: PropTypes.string, // TODO 非必须，有默认值 9
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired
  }
  static COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  }
  render () {
    let width = this.props.width || 16
    let height = this.props.height || 9
    return (
      <canvas ref={$canvas => { this.$canvas = $canvas }} width={width} height={height} />
    )
  }
  componentDidUpdate () {
    var ctx = this.$canvas.getContext('2d')
    this.$chart = new Chart(ctx, {
      type: this.props.type,
      data: this.props.data,
      options: this.props.options
    })
  }
}

export default RChart
