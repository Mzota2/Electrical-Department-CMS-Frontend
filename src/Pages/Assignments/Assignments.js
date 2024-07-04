import React, {useState, useEffect} from 'react';
import './Assignments.css';
import axios from 'axios';
import {appUrl} from '../../Helpers'
import {Close, Brightness1, Add} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { getModules } from '../../State/ModulesSlice';
import SubNav from '../../Components/SubNav/SubNav';
import MiniLoader from '../../Components/MiniLoader/MiniLoader';
import { diff_days, diff_hours } from '../../Helpers';

import { animated, useSpring } from '@react-spring/web';

function Assignments() {

    const dispatch = useDispatch();
    const [showMiniLoader, setShowMiniLoader] = useState(false);
    //modules
    const foundModules = useSelector(state => state.modules.data);
    const moduleStatus = useSelector(state => state.modules.status);


  //active user
  const activeUser = useSelector(state => state.students.activeUser);
  const [assignments, setAssignments] = useState();
  const activeModules = useSelector(state => state.students.modules);
  const [modules, setModules] = useState();

    const [newAssignment, setNewAssignment] = useState({
        moduleId:"",
        title:"",
        dueDate:"",
        dueTime:"00:00",
        description:"",
        type:'individual'
    });

    //assignment-description
    const [toggleDescription, setToggleDescription] = useState();

    //add assign
    const [showAdd, setShowAdd] = useState(false);


    //enlarge
    const [enlarge, setEnlarge] = useState(false);

    //animations
    const slideLeft = useSpring({
        from: { transform: 'translateX(-100%)' },
        to: {transform:'translateX(0%)' }
      });

    function handleShowAdd(){
        setShowAdd(prev => !prev);
    }
    function handleToggleDescription(index){
        setToggleDescription(index);
    }

    function handleChange(e){
        setNewAssignment(prev =>{
            return {
                ...prev,
                [e.target.name]:e.target.value
            }
        })

    }

    async function createAssignment(e){
        e.preventDefault();
        try {
            setShowMiniLoader(true);
          
            
            if(newAssignment?.title && newAssignment?.dueDate && newAssignment?.dueTime){
                const activeModule = foundModules?.find((md)=> md?._id === newAssignment?.moduleId)
                let activeModuleAssignments = activeModule?.assignments?.length? activeModule?.assignments?.concat([newAssignment]): [newAssignment];
    
                
                const response = await axios.put(`${appUrl}module/${newAssignment?.moduleId}`, {...activeModule, assignments:activeModuleAssignments
                });
                const {data} = response;
                console.log(data);

                dispatch(getModules());

                setNewAssignment({
                    moduleId:"",
                    title:"",
                    dueDate:"",
                    dueTime:"00:00",
                    description:"",
                    type:'individual'
                })
               
            }
            
        } catch (error) {
            console.log(error);
        }finally{
            setTimeout(()=>{
                setShowMiniLoader(false);
            }, 3000);
        }
    }


    async function removeCompletedWork(assignments){
            try {
                assignments?.map(async(md)=>{
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                               
                    const newAssignments = md?.assignments?.filter((assign)=>{
                        const year = assign?.dueDate?.slice(0, 4);
                        const month = months[Number(assign?.dueDate?.slice(5, 7)) -1 ];
                        const day = assign?.dueDate?.slice(8, 10);

                        const dt2 = new Date(`${month} ${day}, ${year} ${assign?.dueTime+':00'}`);
                        const dt1 = new Date();

                        if(dt2?.getTime() < dt1?.getTime()){
                            // Calculate the difference in milliseconds between dt2 and dt1
                           var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                           // Convert the difference to days by dividing it by the number of seconds in a day (86400)
                           diff /= (60 * 60 * 24);
                           // Return the absolute value of the rounded difference in days
                           const timePassed =  Math.abs(Math.round(diff));
           
                           if(timePassed < 2){
                                return assign;
                           }
           
                       }
                       else{
                        return assign;
                       }

                        


                    });

                    const response = await axios.put(`${appUrl}module/${md?._id}`, {...md, assignments:newAssignments});
                    const {data} = response;
                    console.log(data);
                })
                
            } catch (error) {
                console.log(error);
            }
    }

    //assignments

    useEffect(()=>{
        if(moduleStatus === 'idle'){
            dispatch(getModules());
        }

        if(foundModules?.length){
            let userModules = foundModules?.filter((md)=>{
                if(activeUser?.modules?.find((id)=> id === md?._id)){
                    return md;
                }
            });

            let userAssignmentModules = userModules?.filter((md)=>{
                return md?.assignments?.length;
            });

            removeCompletedWork(userAssignmentModules);

            setModules(userModules);
            setAssignments(userAssignmentModules);
        }

       
        
    }, [dispatch, moduleStatus, foundModules])
    
  return (

    <div className='cms-assignments-body'>

        {
        showMiniLoader? <MiniLoader/>:<></>
        }


        <div className={`cms-today-main-container`}>

            <div className="cms-assign-tabs">
                <h3 className='cms-assign-title'>Assignments</h3>
                {activeUser?.isClassRep && <div onClick={handleShowAdd} className="cms-add-assign-btn cms-btn">
                    {
                        showAdd? <Close className='cms-assign-add-icon' />:<Add className='cms-assign-add-icon' />
                    }
                    
                </div>}
                
            </div>

            {
                showAdd && activeUser?.isClassRep?

                <form className='cms-form cms-assign-form'>
                    <select  value={newAssignment.moduleId} onChange={handleChange} className='cms-input-field cms-assign-field' name="moduleId" id="module">
                        <option value=""></option>
                        
                        {modules?.map((md)=>{
                            return(
                                <option key={md?._id} value={md?._id}>
                                    {md?.name}
                                </option>
                            )
                        })}
                    </select>

                    <input value={newAssignment.title}  onChange={handleChange} name='title' type="text" placeholder='Enter title' className='cms-input-field cms-assign-field' />

                    <input value={newAssignment.description}  onChange={handleChange} name='description' type="text" placeholder='Enter description' className='cms-input-field cms-assign-field' />

                    <input value={newAssignment.dueTime}  onChange={handleChange} name="dueTime" type="time" placeholder='Set time' className='cms-input-field cms-assign-field' />
                    <input value={newAssignment.dueDate}  onChange={handleChange} name="dueDate" type="date" placeholder='Set date' className='cms-input-field cms-assign-field' />
                        
                    <button onClick={createAssignment} className='cms-btn cms-create-assign-btn'>Create</button>
                
                </form>:

                <div className="cms-assignments-container">

                    {
                            assignments?.map((md)=>{


                            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                            
                            return md?.assignments?.map((assign, index)=>{

                                const year = assign?.dueDate?.slice(0, 4);
                                const month = months[Number(assign?.dueDate?.slice(5, 7)) -1 ];
                                const day = assign?.dueDate?.slice(8, 10);

                                const dt2 = new Date(`${month} ${day}, ${year} ${assign?.dueTime+':00'}`);
                                const dt1 = new Date();

                                console.log(dt2?.getTime());

                    
                                return(
                                    <animated.div onMouseOver={()=>{handleToggleDescription(index)}} style={slideLeft} key={index} className="cms-today-cls cms-assign-cls">

                                        <div className="cms-today-module-title-container">
                                            <h4 className='cms-today-module-title'>{md?.code?.toUpperCase()}</h4>
                                            <div className='cms-assignment-availability-container'>
                                                <p>Active</p>
                                                <div className="cms-today-module-availability"></div>
                                        
                                            </div>
                                            
                                        </div>
                        

                                        <div className="cms--assignment-details-container">
                                            <p><strong>{assign?.title|| assign?.task}</strong></p>

                                            <div className="cms-assignment-time-tracker-container">
                                                <div className="cms-assignment-time-tracker">
                                                    
                                                    <span className="cms-assignment-time-to-go">{diff_days(dt2, dt1)}</span>
                                                    <p>Days to go</p>
                                                </div>

                                                <div className="cms-assignment-time-tracker">
                                                    
                                                    <span className='cms-assignment-time-to-go'>{diff_hours(dt2, dt1)}</span>
                                                    <p>Hours to go</p>
                                                </div>
                                            </div>
                        
                                        </div>

                                        { toggleDescription === index && <div className="cms-assignment-description-container">

                                            <p className="cms-assignment-description-text">{assign?.description}</p>
                                            <div className="cms-assignment-important-dates-container">
                                                <p>{assign?.dueDate}</p>
                                                <p>{assign?.dueTime}</p>
                                            </div>
                                            
                                        </div>}


                                    
                                    </animated.div>
                                )
                            })
                            
                    })
                    }
                </div>

                
                
                
                }

        </div>
            
    

    </div>
 
  )
}

export default Assignments