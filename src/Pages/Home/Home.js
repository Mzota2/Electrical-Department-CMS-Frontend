import React, { useEffect, useState } from 'react'
import image1 from '../../Assets/image1.jpg';
import image2 from '../../Assets/image2.jpg';
import image3 from '../../Assets/image3.jpg';

import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveModules } from '../../State/StudentsSlice';
import { getModules } from '../../State/ModulesSlice';
import Loader from '../../Components/Loader/Loader';
import robotImage from '../../Assets/robot.jpg';
import engineeringGirl from '../../Assets/engineeringGirls.jpg';
import { getPrograms } from '../../State/ProgramsSlice';

import {ExpandMore, ExpandLess, Check, Clear} from '@mui/icons-material'
import { animated, useSpring, useInView } from '@react-spring/web';
import {useNavigate} from 'react-router-dom'
import { appUrl } from '../../Helpers';
import axios from 'axios';

function Message({noticeIndex, notices}){

   //animations
   const slideRight = useSpring({
    from:{transform:'translateX(100%)'},
    to:{transform:'translateX(0%)'}
  });

  useEffect(()=>{

  }, [noticeIndex])

  return(
    <div>
      {
        notices?.map((notice, index)=>{
          if(index === noticeIndex){
            return(
              <animated.p key={notice?._id} style={noticeIndex === index? slideRight:{}} className='cms-home-important-notice-text'>{notices[noticeIndex]?.description}</animated.p>
            )
          }
          
        })
      }
     
    </div>
    
  )
}

function Home() {

    const navigate = useNavigate();

    //notice
    const [notices, setNotices] = useState([]);
    const [noticeIndex, setNoticeIndex] = useState(0);

    //ANALYTICS

    const [classesNum , setClassesNum] = useState(0);
    const [assignmentsNum, setAssignmentsNum] = useState(0);
    const [examsNum, setExamsNum] = useState(0);
    const [groupsNum, setGroupsNum] = useState(0);

    //HIDE AND SHOW SECTIONS

    const [showProjects, setShowProjects] = useState(true);
    const [showEvents, setShowEvents] = useState(true);
    const [showToday, setShowToday] = useState(true);

    //
    const [isLoading, setIsLoading] = useState(false);

    //date and time
    const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const date = new Date();
    const day = date.getDay();
  
    const today = days[day];
    const [ todate, setTodate]= useState(today);
    
     //programs status
     const foundPrograms = useSelector(state => state.programs.data);
     const programsStatus = useSelector(state => state.programs.status);
     const [program, setProgram] = React.useState();

    //floating action bt
   
    //modules
    const foundModules = useSelector(state => state.modules.data);
    const moduleStatus = useSelector(state => state.modules.status);
    const [todayModule, setTodayModule] = useState();
    const [activeModule, setActiveModule] = useState();
    const [displayActiveModule, setDisplayActiveModule] = useState(false);


    const [assignments, setAssignments] = useState();
    const [exams, setExams] = useState();

    const [index, setIndex] = React.useState(1);
    const dispatch = useDispatch();

    const [modules, setModules] = useState();
 
    //active user
    const activeUser = useSelector(state => state.students.activeUser);

    //animations
    const slideUp = useSpring({
      from:{transform:'translateX(-100%)'},
      to:{transform:'translateX(0%)'}
    });

    const [ref, fadeInSlideUp] = useInView(
      () => ({
        from: {
          opacity: 0,
          y: 100,
        },
        to: {
          opacity: 1,
          y: 0,
        },
      }),
      {
        rootMargin: '0% 0%',
      }
    )

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

     //animations
     const slideLeft = useSpring({
      from:{transform:'scale(0)'},
      to:{transform:'scale(1)'}
    });

   
  

    function handleSelectModule(id){
      console.log('clicked');
      setDisplayActiveModule(prev => !prev);
      const selectedModule = modules?.find((md)=> md?._id === id);
      setActiveModule(selectedModule);
    }

    async function findNotices(){
      try {
        const response = await axios.get(`${appUrl}announcement`);
        const {data} = response;

        setNotices(data?.sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt)));
        
      } catch (error) {
        console.log(error);
      }
    }

    function animateNotice(){
      setTimeout(()=>{
        if(noticeIndex < notices?.length-1){
          setNoticeIndex(prev => prev+1)
        }
        else{
          setNoticeIndex(prev => prev-1)
        }
        
      }, 5000)
    }

    React.useEffect(()=>{

        if(programsStatus === 'idle'){
          dispatch(getPrograms());
        }
        else if(programsStatus !== 'idle' ){
          const userProgram = foundPrograms?.find((program)=> program._id === activeUser?.program);
          setProgram(userProgram);
        }

        if(moduleStatus === 'idle'){
            setIsLoading(true)
            dispatch(getModules());
        }

        else if((moduleStatus !== 'idle') && activeUser){
            
             //set my modules
             const myModules = activeUser?.modules?.map((myModule)=>{
              const existingModule = foundModules?.find(md => md._id === myModule);
              if(existingModule){
                return existingModule;
              }
             
            })?.filter((md)=> md); //check if its defined

            const foundToday = myModules?.filter((module)=>{
                const isToday = module?.classDays?.find(cls => cls?.day === todate);
                if(isToday){
                    return isToday;
                }
            });

            setTodayModule(foundToday);
            // setAssignments(foundAssignments);
            // setExams(foundExams);

              const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const date = new Date();

              //my modules active classes
              const activeClasses = myModules?.filter((md)=> md?.classDays?.find(cls => cls?.isCancelled === false && cls?.day === days[date.getDay()]));
              console.log(date.getDay());
              setClassesNum(activeClasses?.length);

              //my assignments
              const activeAssignments = myModules?.map((md)=>{
                console.log(md?.assignments);
                return md?.assignments;
              })?.flat();

              setAssignmentsNum(activeAssignments?.length);

               //my exams
               const activeExams = myModules?.map((md)=>{
                return md?.exams?.map((assign)=>assign)
              })?.flat();

              setExamsNum(activeExams?.length);

              //my groups
              const activeGroups = myModules?.map((md)=>{
                return md?.assignments?.filter((assign)=> assign?.type === 'group')
              })?.flat();

              setGroupsNum(activeGroups?.length);
 
             setActiveModules(myModules);

             }
        
            if(activeUser){

                //dispatch everything that belongs to the user
                const myModules = foundModules?.filter((md)=>{
                    return activeUser?.modules?.find(activeMd => activeMd === md?._id);
                  })
                  setModules(myModules);
              
                dispatch(setActiveModules(myModules))
                
            }
            findNotices();
            setIsLoading(false);

    }, [index, dispatch,moduleStatus, foundModules, foundPrograms, programsStatus, todate]);

    if(isLoading){
        return <Loader show={!isLoading}/>
    }

  return (
    <div style={{backgroundColor:'var(--feint-blue)'}} className=''>

        <div className="home-image-container">
          
          <div className="cms-home-message-container">
            
            <animated.div style={fadeIn} className="cms-home-message-image-container">
              <img className='home-image' src={image1} alt="back" /> 
            </animated.div>

            <div className="cms-home-text-container">
              
              <div className="cms-engineering-mindset">
                <animated.div style={fadeIn}>
                  <h2 className='cms-home-message'>WELCOME TO ELECTRICAL DEPARTMENT CMS</h2>
                </animated.div>
                
              </div>

              <animated.div style={fadeIn}>
                <p className='cms-home-message-quote'>Get all the latest updates on assignments, classes, exams and other class activities.</p>
              </animated.div>
              
             
              <button onClick={()=>{navigate('/semester-info')}} className='cms-btn cms-view-updates-btn'>View Updates</button>
              
            </div>
        
          </div>

          <div className="home-background-overlay"> </div>

        </div>

        <animated.div style={slideUp} className="cms-class-notice-summary-container">
          
            <div className="cms-home-important-notice-container">

              <div className="cms-notice-container">

                <h3 className='cms-home-important-notice-title'>Important notice</h3>

                {notices?.length ? <Message notices={notices} noticeIndex={noticeIndex} />:<>~~None~~</>}            

                <div className="cms-home-important-notice-slider">
                  {
                    notices?.length ? notices?.map((notice, index)=>{
                      if(index <= 2){
                        return (
                          <button style={{backgroundColor:`${noticeIndex === index? "var(--light-blue)":""}`}} onClick={()=>{setNoticeIndex(index)}} key={notice._id} className='cms-notice-slider-btn'>
  
                          </button>
                        )
                      }
                      else if(index === 3){
                        return(
                          <a href='/announcements' style={{backgroundColor:`${noticeIndex === index? "var(--light-blue)":""}`}}>View all</a>
                        )
                      }

                      else{
                        return null;
                      }
                      
                    }):<></>
                  }
                </div>
              </div>

             
            </div>


            <div className="cms-class-analytics-container">
              <div className="cms-class-analytic">
                <span className='cms-class-analytic-num'>{classesNum}</span>
                <p>Classes</p>
              </div>

              <div className="cms-class-analytic">
                <span className='cms-class-analytic-num'>{assignmentsNum}</span>
                <p>Assignments</p>
              </div>

              <div className="cms-class-analytic">
                <span className='cms-class-analytic-num'>{examsNum}</span>
                <p>Exams</p>
              </div>

              <div className="cms-class-analytic">
                
                <span className='cms-class-analytic-num'>{groupsNum}</span>
                <p>Groups</p>
              </div>
            </div>

            
           
        </animated.div>

        <div className="cms-home-todays-classes-container cms-home-section">

          <h3 className='cms-home-classes-today-title'>CLASSES TODAY</h3>

         {<div className="cms-home-todays-classes">
            {
              todayModule?.map((md, index)=>{

      
                // const date = new Date();
                // const day = date.getDay();
                // const today = days[day];

                const isActive= md?.classDays?.find((cls)=> (cls?.day === todate) && (cls?.isCancelled === false));
                // console.log(foundClass);
                // console.log(md);

                return(
                  <animated.div key={md?._id} ref={ref} style={fadeInSlideUp} className="cms-home-today" onClick={()=>{handleSelectModule(md?._id)}}>

                    <div className="cms-home-today-details">
                      <p className='cms-today-name'>{md?.name}</p>
                      <p className='cms-today-code'>{md?.code}</p>
                      <p className='cms-today-lecturer'>{md?.lecturer}</p>

                    
                      <div style={{backgroundColor:`${isActive?'green':'red'}`}} className="cms-today-isActive">
                          {isActive? <Check/>:<Clear/>}
                      </div>
                    </div>

                    {displayActiveModule && md?._id === activeModule?._id &&

                    <div className="cms-home-today-more-info">
                    {
                 
            
                        activeModule?.classDays?.map((dy, idx)=>{
                          return(
                          <div key={idx} className="cms-module-dy cms-module-dy-home">
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
              })
            }
          </div>}
        </div>


        <br />
        <br />

        <hr className='footer-line'/>

        <div className="cms-footer">
         

          <p className='copyright'>© Electrical Department CMS 2024</p>
        </div>



    </div>
  )
}

export default Home