import React, { useEffect, useState } from 'react';
import './SemesterInfo.css';
import Assignments from '../Assignments/Assignments';
import Exams from '../Exams/Exams';
import { useDispatch, useSelector } from 'react-redux';
import { getModules } from '../../State/ModulesSlice';
import { getStudents } from '../../State/StudentsSlice';
import Timetable from '../Timetable/Timetable';
import image1 from '../../Assets/image1.jpg';
import {Close, ViewSidebarOutlined} from '@mui/icons-material';
import { animated, useSpring } from '@react-spring/web';
import Groups from '../../Components/Groups/Groups';
import SubNav from '../../Components/SubNav/SubNav';


function SemesterInfo() {

    const [activeTab, setActiveTab] = useState('Assignments');
    const [viewAssignments, setViewAssignments] = useState(false);
    const [viewExams, setViewExams] = useState(false);
    const [viewGroups, setViewGroups] = useState(false);
    const [viewTimetable, setViewTimetable] = useState(false);

    //dispatch
    const dispatch = useDispatch();

    //sidebar
    const [viewSidebar, setViewSidebar] = useState(false);

    //active user
    const activeUser = useSelector(state => state.students.activeUser);

    //students
    const foundStudents = useSelector(state => state.students.data);
    const foundStudentsStatus = useSelector(state => state.students.status);


    //modules
    const foundModules = useSelector(state => state.modules.data);
    const foundModulesStatus = useSelector(state => state.modules.status);

    //animations
    const slideLeft = useSpring({
        from: { transform: 'translateX(-100%)' },
        to: {transform:'translateX(0%)' }
      });

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

     //const animations
    const slideIn = useSpring({
        from:{left: viewSidebar? '-100%':'0%'},
        to:{left:viewSidebar? '0%':'-100%'}
    });

  

    const [modules, setModules] = useState([]);

    function handleActiveTab(e){
        setActiveTab(e.target.innerText);

        switch(e.target.innerText){
            case 'Assignments':
                setViewAssignments(true);
                setViewExams(false);
                setViewGroups(false);
                setViewTimetable(false);

                break;

            case 'Exams':
                setViewAssignments(false);
                setViewExams(true);
                setViewGroups(false);
                setViewTimetable(false);
                break;

            case 'Groups':
                setViewAssignments(false);
                setViewExams(false);
                setViewGroups(true);
                setViewTimetable(false);
                break;

            case 'Timetable':
                setViewAssignments(false);
                setViewExams(false);
                setViewGroups(false);
                setViewTimetable(true);
                break;

            default:
                break;
        }

        handleViewSidebar();
    }

    function handleViewSidebar(){
        setViewSidebar(prev => !prev);
    }

    useEffect(()=>{

        if(foundModulesStatus === 'idle'){
            dispatch(getModules());
        }
        else if(foundModulesStatus !== 'idle' && foundModules?.length && activeUser){

            const foundGroups = foundModules?.map((md)=>{
                const userId = activeUser?._id;
        
                const myAssignments = md?.assignments?.map(assign =>{

                    const myGroups = assign?.groups?.map((group, ind)=>{
                        const foundGroup =  group?.find(member => member === userId);
                        
                        if(foundGroup !== undefined){
                            const myGroup = {
                                module: md?.name,
                                code:md?.code,
                                group:group,
                                groupNumber: ind+1,
                                task:assign?.task
                            }
                    
                            return myGroup;
                        }
                    }).filter((gp)=> gp);

                    return myGroups;

                });

                 
                 return myAssignments;
    
            });

            const userGroups = foundGroups[0].flat();

            setModules(userGroups);
        }

        if(foundStudentsStatus === 'idle'){
            dispatch(getStudents());
        }

        if(activeTab === 'Assignments'){
            setViewAssignments(true);
        }

    }, [dispatch, foundModules, foundModulesStatus, activeUser, foundStudentsStatus, foundStudents]);


  return (
    <div className='cms-semester-info-body'>

        <SubNav page={'Semester Info'} pageIcon={'fa-exclamation-circle'} />

        <div className="cms-semester-info-container">

            <div className="cms-semester-info-panel">
               
                <button onClick={handleActiveTab} style={activeTab === 'Assignments'?{backgroundColor:'var(--light-blue)', color:'white'}:{}} className="cms-btn cms-semester-panel-tab">Assignments</button>
                <button onClick={handleActiveTab} style={activeTab === 'Exams'?{backgroundColor:'var(--light-blue)', color:'white'}:{}} className="cms-btn cms-semester-panel-tab">Exams</button>
                <button onClick={handleActiveTab} style={activeTab === 'Groups'?{backgroundColor:'var(--light-blue)', color:'white'}:{}} className="cms-btn cms-semester-panel-tab">Groups</button>
                <button onClick={handleActiveTab} style={activeTab === 'Timetable'?{backgroundColor:'var(--light-blue)', color:'white'}:{}} className="cms-btn cms-semester-panel-tab">Timetable</button>
            </div>

            <animated.div style={slideIn} className="cms-semester-info-panel-mobile">
                
                <div style={{marginLeft:"0px"}}  onClick={handleViewSidebar} className="profile-menu-icon-container">
                    <Close className='cms-menu-icon'/>
                </div>

                <br />

                <button onClick={handleActiveTab} style={activeTab === 'Assignments'?{backgroundColor:'var(--light-blue)', color:'white'}:{}} className="cms-btn cms-semester-panel-tab">Assignments</button>
                <button onClick={handleActiveTab} style={activeTab === 'Exams'?{backgroundColor:'var(--light-blue)', color:'white'}:{}} className="cms-btn cms-semester-panel-tab">Exams</button>
                <button onClick={handleActiveTab} style={activeTab === 'Groups'?{backgroundColor:'var(--light-blue)', color:'white'}:{}} className="cms-btn cms-semester-panel-tab">Groups</button>
                <button onClick={handleActiveTab} style={activeTab === 'Timetable'?{backgroundColor:'var(--light-blue)', color:'white'}:{}} className="cms-btn cms-semester-panel-tab">Timetable</button>
            </animated.div>

            <div className="cms-semester-info-menu-mobile">
                <div onClick={handleViewSidebar} className="cms-semester-info-panel-mobile-sidebar-icon">
                    <ViewSidebarOutlined className='cms-sidebar-icon'/>
                </div>

                <p>Select option</p>
            </div>

            

            {
                viewAssignments? <Assignments/>:<></>
            }

            {
                viewExams? <Exams/>:<></>
            }

            {viewGroups?
            <Groups modules={modules} slideLeft={slideLeft} foundStudents={foundStudents}/>

            :<></>
            
            }

            {
            viewTimetable? <Timetable/>:<></>
            
            }

        </div>

    </div>
  )
}

export default SemesterInfo