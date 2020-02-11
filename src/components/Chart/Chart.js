import React, { Component } from 'react'
import { scaleBand, scaleLinear } from 'd3-scale';
import { timeParse } from 'd3-time-format';
import ResponsiveWrapper from './ResponsiveWrapper'
import Axes from './Axes';
import Bars from './Bars';
import {connect} from 'react-redux';


class Chart extends Component {
  constructor() {
    super()
    this.xScale = scaleBand()
    this.yScale = scaleLinear()
  }

  render() {
    const parseDate = timeParse("%Y-%m-%d");
    let {graphData} = this.props;
    let barData = [];
    graphData = graphData.filter((datum, index) => index<7)
    graphData.map((datum) => barData.push({x: parseDate(datum.date), y: datum.totalDuration}))
    barData.sort((a, b) => new Date(a.x) - new Date(b.x))
    const margins = { top: 50, right: 20, bottom: 100, left: 60 };
    const svgDimensions = { 
        width: Math.max(this.props.parentWidth, 300), 
        height: 275 
    };

    const maxValue = Math.max(...barData.map(d => d.y))
    
    // scaleBand type
    const xScale = this.xScale
      .padding(0.5)
      // scaleBand domain should be an array of specific values
      // in our case, we want to use movie titles
      .domain(barData.map(d => d.x))
      .range([margins.left, svgDimensions.width - margins.right])
  
     // scaleLinear type
    const yScale = this.yScale
       // scaleLinear domain required at least two values, min and max       
      .domain([0, maxValue])
      .range([svgDimensions.height - margins.bottom, margins.top])

    return (
      <svg width={svgDimensions.width} height={svgDimensions.height}>
         <Axes 
            scales={{ xScale, yScale }}
            margins={margins}
            svgDimensions={svgDimensions}
         />
         <Bars
          scales={{ xScale, yScale }}
          margins={margins}
          barData={barData}
          maxValue={maxValue}
          svgDimensions={svgDimensions}
        />
      </svg>
    )
  }
}

const mapStateToProps = state => {
    return {
        graphData: state.logs.graph,
    };
};


export default ResponsiveWrapper(connect(mapStateToProps,null)(Chart));
