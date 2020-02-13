import React from 'react'
import { scaleBand, scaleLinear } from 'd3-scale';
import { timeParse } from 'd3-time-format';

import Axes from './Axes';
import Bars from './Bars';
import { useSelector } from 'react-redux';

const Chart = (props) => {
  

  const parseDate = timeParse("%Y-%m-%d");
  let graphData = useSelector(state => state.logs.graph);
  let barData = [];
  graphData = graphData.filter((datum, index) => index<7)
  graphData.map((datum) => barData.push({x: parseDate(datum.date), y: datum.totalDuration}))
  barData.sort((a, b) => new Date(a.x) - new Date(b.x))
  const margins = { top: 50, right: 20, bottom: 100, left: 60 };
  const svgDimensions = { 
      width: props.containerWidth, 
      height: props.containerHeight
  };

  const maxValue = Math.max(...barData.map(d => d.y))
  
  // scaleBand type
  const xScale = scaleBand()
    .padding(0.5)
    // scaleBand domain should be an array of specific values
    // in our case, we want to use movie titles
    .domain(barData.map(d => d.x))
    .range([margins.left, svgDimensions.width - margins.right])

    // scaleLinear type
  const yScale = scaleLinear()
      // scaleLinear domain required at least two values, min and max       
    .domain([0, maxValue])
    .range([svgDimensions.height - margins.bottom, margins.top])

    

    return (
      <div>
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
      </div>
    )
  }

// const mapStateToProps = state => {
//     return {
//         graphData: state.logs.graph,
//     };
// };


// export default ResponsiveWrapperHook(
  // connect(mapStateToProps,null)
  // (Chart));

  export default Chart;