import React from 'react'
import PropTyes from 'prop-types'

const Progress = ({percentage}) => {
    return (
        <div className="progress">
            <div 
            className="progress-bar progress-bar-striped bg-success" 
            role="progressbar" 
            style={{width: `${percentage}%`}}
           >


                {percentage}%
            </div>
        </div>
    )
}

Progress.propTypes = {
    percentage: PropTyes.number.isRequired
}

export default Progress;