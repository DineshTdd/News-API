import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { interpolateLab } from 'd3-interpolate'

export default class Bars extends Component {
  constructor(props) {
    super(props)

    this.colorScale = scaleLinear()
      .domain([0, this.props.maxValue])
      .range(['#fff5e6', '#ff9900'])
      .interpolate(interpolateLab)
  }

  render() {
    const { scales, margins, barData, svgDimensions } = this.props
    const { xScale, yScale } = scales
    const { height } = svgDimensions

    const bars = (
      barData.map(datum =>
        <rect
          key={datum.x}
          x={xScale(datum.x)}
          y={yScale(datum.y)}
          height={height - margins.bottom - scales.yScale(datum.y)}
          width={xScale.bandwidth()}
          fill={this.colorScale(datum.y)}
        />,
      )
    )

    return (
      <g>{bars}</g>
    )
  }
}