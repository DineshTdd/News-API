import React from 'react'

export default ({hoveredBar, scales}) => {
    const { xScale, yScale } = scales
    const styles = {
      left: `${xScale(hoveredBar.x) - 30}px`,
      top: `${yScale(hoveredBar.y)}px`
    }
  
    return (
      <div className="Tooltip" style={styles}>
        <h6>Active Minutes: {hoveredBar.y}</h6>
      </div>
    )
  }