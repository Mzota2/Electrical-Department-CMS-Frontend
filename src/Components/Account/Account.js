import React, {useEffect, useRef, useState} from 'react'
import './Account.css';
import { Settings, Logout, Close, Engineering, Help, LightbulbCircle, NotificationImportantOutlined} from '@mui/icons-material';
import {message} from 'antd'
import { Link, useNavigate } from 'react-router-dom';
import {animated, useSpring} from '@react-spring/web';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import { appUrl } from '../../Helpers';


function Account({student, handleClose, show, handleShowAccount}) {
  const navigate = useNavigate();
  const menu = useRef(null);

  //semesterdates
  const [schoolDates, setSchoolDates] = useState({
    startDate:'',
    endDate:''
});

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

  async function getSchoolDates(){
    try {

        const response = await axios.get(`${appUrl}settings`);
        let {data} = response;
        

        console.log(data);

        const months = ['Jan', 'Feb', 'Mar', 'Apri', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        let startDate = data[0]?.openingDate;
        let endDate = data[0]?.closingDate;
        setSchoolDates((prev)=>{
            return {
                ...prev,
                startDate:`${startDate?.slice(8)} ${months[Number(startDate?.slice(5,7))-1]} ${startDate?.slice(0, 4)}`,
                endDate:`${endDate?.slice(8)} ${months[Number(endDate?.slice(5,7))-1]} ${endDate?.slice(0, 4)}`,
            }
        });
    } catch (error) {
        console.log(error);
    }
}


  useEffect(()=>{


    getSchoolDates();

    // document.addEventListener('click', (e)=>{
    //   handleClickMenu(e)
    // })

    // return (()=>{
    //   document.removeEventListener('click', (e)=>{
    //     handleClickMenu(e)
    //   })
    // })
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

          <div className="cms-semester-dates-container cms-semester-dates-account">
              <p>{schoolDates?.startDate}</p>
              <p>-</p>
              <p>{schoolDates?.endDate}</p>
          </div>

        </div>        

      </div>

  
    </animated.div>
  )
}

export default Account