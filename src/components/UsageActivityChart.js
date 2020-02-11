import React, { Component } from "react";
import {connect} from 'react-redux';
import * as d3 from "d3";
import Tooltip from './Tooltip';

class UsageActivityChart extends Component {
    constructor(props) {
        super(props);
        this.xaxisRef = null;
        this.yaxisRef = null;
        this.state = {
            margin: {
                top: 40, 
                right: 40,
                bottom: 60,
                left: 80
            },
            width: 500,
            height: 275,
            hoveredBar: null
        }
        this.x = d3.scaleBand().range([0, this.state.width - this.state.margin.left - this.state.margin.right]).padding(0.1);

        this.y = d3.scaleLinear().range([this.state.height - this.state.margin.top - this.state.margin.bottom, 0]);
    }

    createAttributesY(selection) {
    
        selection
            .selectAll("text")
            .attr("transform", "rotate(0)")
            .attr("y", 5)
            .attr("dy", ".60em")
            .style("text-anchor", "end")
            
    }


    componentDidMount() {
        
        d3.select(this.xaxisRef)
        .call(d3.axisBottom(this.x)
        .tickFormat(d3.timeFormat("%Y-%m-%d")))
        .call((selection) => {
            return selection
            .attr("transform", `translate(0,${this.state.height - this.state.margin.top - this.state.margin.bottom})`)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-45)")
        });

        d3.select(this.yaxisRef)
        .call(d3.axisLeft(this.y)
        .ticks(10))
        .call(this.createAttributesY);
    }

    render() {
        const parseDate = d3.timeParse("%Y-%m-%d");
        const {graphData} = this.props;
        const { height, margin } = this.state;
        let barData = [];
        if (graphData.length > 0 && graphData.length > 7) {
            for (let i=0; i< 7; i++) {
                barData.push({x: parseDate(graphData[i].date), y:graphData[i].totalDuration});
            }
        } else if(graphData.length > 0 && graphData.length <= 7 ) {
            graphData.map(item => {barData.push({x:parseDate(item.date), y:item.totalDuration}); return item})
        }

        
        this.x.domain(barData.map(function (d) {
            return d.x;
          }));
        this.y.domain([0, d3.max(barData, function (d) {
        return d.y;
        })]);

        return(
            <div>
                { this.state.hoveredBar ?
                <Tooltip
                    hoveredBar={this.state.hoveredBar}
                    scales={{xScale:this.x, yScale:this.y }}
                /> :
                null
                }
            <svg width={this.state.width} 
                 height={this.state.height} >
                    {barData.map((datum) => (
                        <rect key={datum.x}
                        fill="orange"
                        className="bar"
                        height={(height - margin.top - margin.bottom) - this.y(datum.y)} 
                        y={this.y(datum.y)} 
                        width={this.x.bandwidth()}
                        x={this.x(datum.x)}
                        onMouseEnter={async () => { await this.setState({hoveredBar: datum})}}
                        onMouseLeave={async() => await this.setState({hoveredBar: null})}
                        >
                        </rect>
                    ))}
                    <g ref={(xaxisRef) => this.xaxisRef = xaxisRef}></g>
                    <g ref={(yaxisRef) => this.yaxisRef = yaxisRef}></g>
            </svg>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        graphData: state.logs.graph,
    };
};


export default connect(mapStateToProps,null)(UsageActivityChart);
