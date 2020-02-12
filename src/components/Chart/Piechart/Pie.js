import React from "react";
import { scaleOrdinal } from 'd3-scale';
import { format } from 'd3-format';
import { pie, arc } from 'd3-shape';
import { schemeCategory10 } from 'd3-scale-chromatic';

const Arc = ({ data, index, createArc, colors, format, total }) => (
  <g key={index} className="arc">
    <path className="arc" d={createArc(data)} fill={colors(index)} />
    <text
      transform={`translate(${createArc.centroid(data)})`}
      textAnchor="middle"
      alignmentBaseline="middle"
      fill="white"
      fontSize="10"
    >
      {format((data.data.y/total)*100)}
    </text>
  </g>
);

const Pie = props => {
  const createPie = pie()
    .value(d => +d.y)
    .sort(null);
  const createArc = arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius);
  const colors = scaleOrdinal(schemeCategory10);
  const formatValue = format(".2f");
  const data = createPie(props.data);
  const totalValue = data => data.reduce((a,b) => parseInt(a) + parseInt(b.y), 0)
  const total = totalValue(props.data)

  return (
    <svg width={props.width} height={props.height}>
      <g transform={`translate(${props.outerRadius} ${props.outerRadius})`}>
        {data.map((d, i) => (
          <Arc
            key={i}
            data={d}
            index={i}
            createArc={createArc}
            colors={colors}
            format={formatValue}
            total={total}
          />
        ))}
      </g>
    </svg>
  );
};

export default Pie;