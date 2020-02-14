import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { interpolateLab } from 'd3-interpolate'
import { connect } from 'react-redux'
import * as logsAction from '../../../store/action/logsAction'

class Bars extends Component {
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
    const barHeight = height - margins.bottom 
    const bars = (
      barData.map(datum =>
        <rect
          key={datum.x}
          x={xScale(datum.x)}
          y={yScale(datum.y)}
          height={barHeight - scales.yScale(datum.y)}
          width={xScale.bandwidth()}
          fill={this.colorScale(datum.y)}
          onMouseOver={() => {
            // this.props.handleMouseOver("007", ev);
            this.props.setBarValue({value:datum.y, x: xScale(datum.x), y: yScale(datum.y), barHeight: barHeight - scales.yScale(datum.y)}) 
          }}
          onMouseOut={() => this.props.setBarValue({value: null, x: null, y: null})}
        />,
      )
    )

    return (
      <g>{bars}</g>
    )
  }
}

const mapStateToProps = state => {
  return {
      barValue: state.logs.barValue,
  };
};

const mapDispatchToProps = dispatch => {
  return {
      setBarValue: (value) => dispatch({type: logsAction.SET_BAR_VALUE, payload: {value: value} }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Bars);