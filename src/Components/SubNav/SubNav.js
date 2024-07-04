import React from 'react';
import { Link } from 'react-router-dom';
import './SubNav.css';

function SubNav({page, pageIcon}) {
  return (
    <div className='cms-sub-nav-body'>

        <div className="cms-sub-nav-main-container">
          <Link to={'/'} className="sub-nav-logo-container">
                <h1 className='logo-title-sub-nav'>CMS</h1>
                <p className='logo-desc-sub-nav'>Electrical Department D2</p>
          </Link>

          <span>|</span>

          <div className="cms-sub-nav-icon-container">
           
            <i className={`fa-solid ${pageIcon}`}></i>
            <p className='cms-sub-nav-page-title'>{page}</p>
          </div>
        </div>
    </div>
  )
}

export default SubNav