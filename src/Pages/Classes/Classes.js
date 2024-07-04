import React, { useState } from 'react';
import './Classes.css';
import { Link } from 'react-router-dom';
import SubNav from '../../Components/SubNav/SubNav';
import {useDispatch, useSelector} from 'react-redux';
import {getModules} from '../../State/ModulesSlice';
import axios from 'axios';
import { appUrl } from '../../Helpers';

import image1 from '../../Assets/image1.jpg';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Loader from '../../Components/Loader/Loader';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { message } from 'antd';
import MiniLoader from '../../Components/MiniLoader/MiniLoader';
import {animated, useSpring} from"@react-spring/web";


function ClassModule({mod, setClassOnOff, handleSelectModule, displayActiveModule, activeModule, activeUser, isDay, isOff}) {

   //animations
    const slideTop = useSpring({
      from:{y:100},
      to:{y:0}
    });

    return(
      <animated.div style={slideTop} className='cms-class-module' key={mod?._id} >

              <p className='cms-today-name'>{mod?.name}</p>
              <p className='cms-today-code'>{mod?.code}</p>
              <p className='cms-today-lecturer'>{mod?.lecturer}</p>
         
        {activeUser?.isClassRep &&<div className="cms-module-status-container">
        {isDay && !isOff?
        <i className="fas fa-toggle-on m-status m-status-on" onClick={()=>{setClassOnOff(mod?._id, false)}} ></i>:
          isDay && isOff?
        <i className="fas fa-toggle-off m-status  m-status-off" onClick={()=>{setClassOnOff(mod?._id, true)}}></i>:<></>
        
      }
        
        </div>}

         <div style={{marginLeft:'auto'}} onClick={()=>{handleSelectModule(mod?._id)}} className="cms-module-expand-container">
          {
            displayActiveModule && mod?._id === activeModule?._id? <ExpandMore className='cms-expand-icon'/>: <ExpandLess className='cms-expand-icon'/>
          }
         </div>

        {
          displayActiveModule && mod?._id === activeModule?._id &&
          <div className="module-more-details">
              {
                activeModule?.classDays?.map((dy, idx)=>{
                  return(
                  <div key={idx} className="cms-module-dy">
                      <div className="cms-module-dy-info">
                      <p>{dy?.from}</p>
                      <span>-</span>
                      <p>{dy?.to}</p>
                      <p>{dy?.day}</p>
                      <p>{dy?.room}</p>
                    </div>
                    <hr className='hr-line'/>

                  </div>)
                })
              }
         </div>
        }
         
      </animated.div>
    )
  
}

function Classes() {

  //tab
  const [activeTab, setActiveTab] = useState('All');
  const [showMiniLoader, setShowMiniLoader] = useState(false);

  //dispatch
  const dispatch = useDispatch();

  const [activeModule, setActiveModule] = React.useState();
  const [displayActiveModule, setDisplayActiveModule] = React.useState(false);


  //student
 // const [user, setUser] = React.useState();
  const activeUser = useSelector((state)=> state.students.activeUser);
  const activeUserModules = useSelector(state => state.students.modules);

  //modules
  const foundModules = useSelector(state => state.modules.data);
  const modulesStatus = useSelector(state => state.modules.status);
  const [modules, setModules] = React.useState();

  //animations
  const fadeIn = useSpring({
    from:{
      opacity:0,
    },

    to:{
      opacity:1
    },

    config:{
      duration:2000
    }
  })

  function handleActiveTab(e){
    const days = ['Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    const day = date.getDay();
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dayy = date.getDate()
    if(e.target.innerText === 'Pending'){
      const activeModules = foundModules?.map((md)=>{
        const foundClass = md?.classDays?.filter((cls => cls?.day ===  days[day] && (cls?.isCancelled === false)))
        ?.map((cls)=>{
          const startTime = cls?.from;
          const endTime = cls?.to;
          
          const year = date.getFullYear();
          const month = months[date.getMonth()];

          
          const dt2 = new Date(`${month} ${dayy}, ${year} ${startTime+':00'}`);
          const dt3 = new Date(`${month} ${dayy}, ${year} ${endTime+':00'}`);
          const dt1 = new Date();

          console.log(dt2);

          if(dt1.getTime() < dt2.getTime() ){
            return md;
          }

        });

        console.log(foundClass);

        return foundClass;
       
        // return isActive;
      })?.flat()?.filter((md)=> md);

      console.log(activeModules);

      setModules(activeModules);
    }

    else if(e.target.innerText === 'Active'){

      const activeModules = foundModules?.map((md)=>{
        const foundClass = md?.classDays?.filter((cls => cls?.day ===  days[day] && (cls?.isCancelled === false)))
        ?.map((cls)=>{
          const startTime = cls?.from;
          const endTime = cls?.to;
          
          const year = date.getFullYear();
          const month = months[date.getMonth()];

          
          const dt2 = new Date(`${month} ${dayy}, ${year} ${startTime+':00'}`);
          const dt3 = new Date(`${month} ${dayy}, ${year} ${endTime+':00'}`);
          const dt1 = new Date();

          console.log(dt2);

          if(dt1.getTime() >= dt2.getTime() && dt1.getTime() <= dt3.getTime()){
            return md;
          }

        });

        return foundClass;
       
        // return isActive;
      })?.flat()?.filter((md)=> md);

      setModules(activeModules);
    }

    

    else if(e.target.innerText === 'Completed'){
      const activeModules = foundModules?.map((md)=>{
        const foundClass = md?.classDays?.filter((cls => cls?.day ===  days[day] && (cls?.isCancelled === false)))
        ?.map((cls)=>{
          const startTime = cls?.from;
          const endTime = cls?.to;
          
          const year = date.getFullYear();
          const month = months[date.getMonth()];

          
          const dt2 = new Date(`${month} ${dayy}, ${year} ${startTime+':00'}`);
          const dt3 = new Date(`${month} ${dayy}, ${year} ${endTime+':00'}`);
          const dt1 = new Date();

          console.log(dt2);

          if(dt1.getTime() > dt3.getTime() ){
            return md;
          }

        });

        return foundClass;
       
        // return isActive;
      })?.flat()?.filter((md)=> md);

      setModules(activeModules);
    }

    else if(e.target.innerText === 'Cancelled'){
      const cancelledModules = foundModules?.filter((md)=>{
        const isCancelled = md?.classDays?.find((dy)=> (dy.day === days[day]) && (dy.isCancelled === true));
        return isCancelled;
      });

      setModules(cancelledModules);
    }

    else if(e.target.innerText === 'All'){
      setModules(foundModules);
    }

    setActiveTab(e.target.innerText);

  }

  function handleSelectModule(id){
    setDisplayActiveModule(prev => !prev);
    const selectedModule = modules?.find((md)=> md?._id === id);
    setActiveModule(selectedModule);
    
  }

  async function updateStudentModule(id, module, bool){
    try {
      setShowMiniLoader(true);
      const response = await axios.put(`${appUrl}module/${id}`, {...module});
      const {data} = response;
      dispatch(getModules());
      message.success(`${module?.name} is ${bool?' on': 'off'}`)
      
    } catch (error) {
      console.log(error);
    }finally{
      setTimeout(()=>{
        setShowMiniLoader(false);
      }, 3000);
    }
  }

  async function setClassOnOff(id, bool){
    let selectedModule = modules?.find((md)=> md?._id === id);
    setActiveModule(selectedModule);

    //set active module above
    const days = ['Sunday','Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    const day = date.getDay();
    const today = days[day];

    let updateModule = selectedModule?.classDays?.find((dy)=> dy.day === today);
    const result = {...updateModule};

    if(updateModule){
      console.log(result?.isCancelled);
      result.isCancelled = !bool;
      console.log(result?.isCancelled);
      const index = selectedModule?.classDays?.indexOf(updateModule);

      const moduleClassDays = [...selectedModule?.classDays];
      moduleClassDays[index] = result;

      const module = {...selectedModule, classDays:moduleClassDays};

      console.log(module);

      updateStudentModule(id, module, bool); //updated class module
      
    }
    //updateModules(id, selectedModule);

  }

  React.useEffect(()=>{

    //user
   
    // setUser(activeUser);
    if(modulesStatus === 'idle'){
        dispatch(getModules());
    }

    else if(modulesStatus !== 'idle' && activeUserModules){
      setModules(activeUserModules);

    }

  }, [dispatch, foundModules, modulesStatus, activeUser]);

  if(modulesStatus === 'idle'){
    return <Loader/>
  }

  return (
    <div>

      {
        showMiniLoader? <MiniLoader/>:<></>
      }
    
        <div  className="cms-students-background">

          <animated.div style={fadeIn} className="cms-students-text">
              <h1 className='cms-students-title'>CLASSES</h1>
              <p className='cms-students-description'>Find your classes</p>
          </animated.div>

          
          
            <animated.img style={fadeIn} src={image1} alt="" className='cms-module-backgroundImage' />
            <div className="video-background-overlay"></div>
        </div>
    
       <div className="class-modules-container">

          <div className="class-module-tabs-container">
                    <button onClick={handleActiveTab}  className={`${activeTab === 'Pending' ? 'activate-tab':'class-module-tab'} class-module-tab cms-student-classes-tab`}>
                      <span className='cms-class-pending-icon'></span>
                      <p>Pending</p>
                    
                    </button>

                    <button onClick={handleActiveTab}  className={`${activeTab === 'Active' ? 'activate-tab':'class-module-tab'} class-module-tab cms-student-classes-tab`}>
                      <Brightness1Icon className='cms-class-on-icon'/>
                      <p>Active</p>
                    
                    </button>
                
                    <button onClick={handleActiveTab}  className={`${activeTab === 'Completed' ? 'activate-tab':'class-module-tab'} class-module-tab cms-student-classes-tab`}>
                    <span className='cms-class-completed-icon'></span>
                      <p>Completed</p>
                    
                    </button>

                    <button onClick={handleActiveTab} className={`${activeTab === 'Cancelled' ? 'activate-tab':'class-module-tab'} class-module-tab cms-student-classes-tab`}>
                      <RadioButtonUncheckedIcon className='cms-class-off-icon' />
                      <p>Cancelled</p>
                    </button>
        
                    <button onClick={handleActiveTab} className={`${activeTab === 'All' ? 'activate-tab':'class-module-tab'} class-module-tab cms-student-classes-tab`}>All</button>
                    
                    
              
            </div>

          <div className="class-modules-window">

          {modules?.map((mod)=>{
            const days = ['Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const date = new Date();
            const day = date.getDay();
            const today = days[day];
  
            const isDay = mod?.classDays?.find((dy)=> dy.day === today);
            const isOff = mod?.classDays?.find((dy)=> dy.isCancelled === true);

            return(
              <ClassModule isDay={isDay} isOff={isOff} activeModule={activeModule} mod={mod} handleSelectModule={handleSelectModule} activeUser={activeUser} setClassOnOff={setClassOnOff} displayActiveModule={displayActiveModule} />
            )
          })}

        </div>

      </div>
      
      
    </div>
  )
}

export default Classes