import React, {useEffect, useRef, useState} from 'react'
import './Account.css';
import { Settings, Logout, Close, Engineering, Help, LightbulbCircle, NotificationImportantOutlined} from '@mui/icons-material';
import {message} from 'antd'
import { Link, useNavigate } from 'react-router-dom';
import {animated, useSpring} from '@react-spring/web';
import InfoIcon from '@mui/icons-material/Info';


function Account({student, handleClose, show, handleShowAccount}) {
  const navigate = useNavigate();
  const menu = useRef(null);

  const [logingOut, setLogingOut] = useState(false);
  //const animations
  const slideIn = useSpring({
    from:{right: show? '-100%':'0%'},
    to:{right:show? '0%':'-100%'}
  });

  function handleClickMenu(e){
    if(!menu?.current){
      handleClose();
    }
  }

  function logout(){
    setLogingOut(true);
    setTimeout(()=>{
      localStorage.removeItem('cms-user');
      navigate('/signin');
      message.success("Loged out successfully");
    }, 2000);
   
  }

  useEffect(()=>{


    document.addEventListener('click', (e)=>{
      handleClickMenu(e)
    })

    return (()=>{
      document.removeEventListener('click', (e)=>{
        handleClickMenu(e)
      })
    })
  }, [])

  return (
    <animated.div ref={menu} style={slideIn}  className='cms-account-container'>
    
      <div className="cms-account-user-info-container">
        <div onClick={handleShowAccount} className="profile-menu-icon-container cms-account-profile-menu-icon">
              {show && <Close className='cms-menu-icon'/>}
        </div>

        <div onClick={()=>{handleShowAccount(); navigate('/settings');}} className="cms-account-student-container">
          <div className="cms-engineer-icon-container">
            <Engineering className='cms-account-engineer-icon'/>
          </div>

          <div className="cms-account-student-details">
            <p><strong>{student?.username}</strong></p>
            <p className='cms-account-student-regNo'>{student?.regNO}</p>
          </div>
       
        </div>

        <div className="cms-account-shortcut-container">
          <p>Your shortcuts</p>
        </div>
    

        <hr className='hrb' />


        <div onClick={handleShowAccount} className="cms-account-student-additional-container">

          <div onClick={()=>{navigate('/semester-info')}} className="cms-account-student-additional">
              <InfoIcon className='cms-account-icon'/>
              <p className='cms-account-important-title'>Semester Info</p>
          </div>

          <div onClick={()=>{navigate('/announcements')}} className="cms-account-student-additional">
              <NotificationImportantOutlined className='cms-account-icon'/>
              <p className='cms-account-important-title'>Messages</p>
          </div>

          <div className="cms-account-student-additional">
              <LightbulbCircle className='cms-account-icon'/>
              <p className='cms-account-important-title'>Suggestion Box</p>
          </div>

          <div className="cms-account-student-additional">
              <Help className='cms-account-icon'/>
              <p className='cms-account-important-title'>Help & Support</p>
          </div>

          <div onClick={()=>{navigate('/settings')}} className="cms-account-student-additional">
              <Settings className='cms-account-icon'/>
              <p className='cms-account-important-title'>Settings</p>
          </div>

          <div onClick={logout} className="cms-account-student-additional">
              <Logout className='cms-account-icon'/>
              <p className='cms-account-important-title'>Logout</p>
          </div>

        </div>        

      </div>

  
    </animated.div>
  )
}

export default Account