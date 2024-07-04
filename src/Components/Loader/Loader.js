import React from 'react'
import './Loader.css';

function Loader({show}) {
  return (
    <div className={`cms-loader-container ${show? 'cms-load':''}`}>
        <div className="loader">
            <div className="loader-heart">
            </div>
        </div>
    </div>
  )
}

export default Loader