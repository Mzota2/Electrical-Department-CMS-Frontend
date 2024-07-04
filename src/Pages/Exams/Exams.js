import React, { useEffect, useState } from 'react';
import "./Exams.css";
import axios from 'axios';
import { appUrl, diff_days, diff_hours } from '../../Helpers';
import {Close, Brightness1, Add} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getModules } from '../../State/ModulesSlice';
import SubNav from '../../Components/SubNav/SubNav';
import MiniLoader from '../../Components/MiniLoader/MiniLoader';
import { animated, useSpring } from '@react-spring/web';
import { duration } from '@mui/material';

function Exams() {

    const dispatch = useDispatch();
    const [showMiniLoader, setShowMiniLoader] = useState(false);
      //modules
    const foundModules = useSelector(state => state.modules.data);
    const moduleStatus = useSelector(state => state.modules.status);


    //active user
    const activeUser = useSelector(state => state.students.activeUser);
    const [assignments, setAssignments] = useState();
    const [exams, setExams] = useState();
    const activeModules = useSelector(state => state.students.modules);
    const [modules, setModules] = useState();
      

    const [newExam, setNewExam] = useState({
        title:"",
        date:"",
        time:{from:"00:00", to:"00:00"},
        description:""
    });

    //assignment-description
    const [toggleDescription, setToggleDescription] = useState();

    //enlarge
    const [enlarge, setEnlarge] = useState(false);

     //add assign
     const [showAdd, setShowAdd] = useState(false);

     //animations
     const slideLeft = useSpring({
        from: { transform: 'translateX(-100%)' },
        to: {transform:'translateX(0%)' },
      });

    function handleShowAdd(){
        setShowAdd(prev => !prev);
    }
    function handleToggleDescription(index){
        setToggleDescription(index);
    }

    function handleChange(e){
        setNewExam(prev =>{
            return {
                ...prev,
                [e.target.name]:e.target.value
            }
        })

    }

    function handleChangeTime(e){
        setNewExam(prev =>{
            let newTime= {
                [e.target.name]:e.target.value
            };

            return {
                ...prev,
                time:{...prev.time, ...newTime}
            }
        })
    }

    async function createExam(e){
        e.preventDefault();

        if(newExam?.title){

            try {
                setShowMiniLoader(true);
                const activeModule = foundModules?.find((md)=> md?._id === newExam?.title)
                let activeModuleExams = activeModule?.exams?.length? activeModule?.exams?.concat([newExam]): [newExam];
    
                const response = await axios.put(`${appUrl}module/${newExam?.title}`, {...activeModule, exams:activeModuleExams}
                );
                const {data} = response;
                console.log(data);

                dispatch(getModules());
                setNewExam({
                    title:"",
                    date:"",
                    time:{from:"00:00", to:"00:00"},
                    description:""
                });
                
            } catch (error) {
                console.log(error);
            }finally{

                setTimeout(()=>{
                    setShowMiniLoader(false);
                }, 3000);
            }
        }
    }

    async function removeCompletedWork(exams){
        try {
            const updatedExamList = exams?.map( async(md)=>{
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                           
                const newExams = md?.exams?.filter((exam, index)=>{
                    const year = exam?.date?.slice(0, 4);
                    const month = months[Number(exam?.date?.slice(5, 7)) -1 ];
                    const day = exam?.date?.slice(8, 10);

                    const dt2 = new Date(`${month} ${day}, ${year} ${exam?.time?.from+':00'}`);
                    const dt1 = new Date();

                    if(dt2?.getTime() < dt1?.getTime()){
                        // Calculate the difference in milliseconds between dt2 and dt1
                       var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                       // Convert the difference to days by dividing it by the number of seconds in a day (86400)
                       diff /= (60 * 60 * 24);
                       // Return the absolute value of the rounded difference in days
                       const timePassed =  Math.abs(Math.round(diff));
       
                       if(timePassed < 2){
                            return  exam;
                            // const response = await axios.put(`${appUrl}module/${md?._id}`, {exams:})
                       }
                   }
                   else{
                    return exam;
                   }
                   
                });

                const response = await axios.put(`${appUrl}module/${md?._id}`, {...md, exams:newExams});
                const {data} = response;
                console.log(data);
            })
            
            
            
        } catch (error) {
            console.log(error);
        }
}

    useEffect(()=>{
        if(moduleStatus === 'idle'){
            dispatch(getModules());
        }

        //set modueles

        if(foundModules?.length){
            let userModules = foundModules?.filter((md)=>{
                if(activeUser?.modules?.find((id)=> id === md?._id)){
                    return md;
                }
            });

            let userExamModules = userModules?.filter((md)=>{
                return md?.exams?.length;
            });

            removeCompletedWork(userExamModules);

            setModules(userModules);
            setExams(userExamModules);
        }


    }, [dispatch, moduleStatus, foundModules])
  return (

    <div className='cms-assignments-body'>

        {
            showMiniLoader? <MiniLoader />:<></>
        }
    
        

        <div className={`cms-today-main-container`}>
            
            <div className="cms-assign-tabs">
                <h3 className='cms-assign-title'>Exams</h3>
                {activeUser?.isClassRep && <div onClick={handleShowAdd} className="cms-add-assign-btn cms-btn">
                    {
                        showAdd? <Close className='cms-assign-add-icon' />:<Add className='cms-assign-add-icon' />
                    }
                    
                </div>}
            </div>

            {
                showAdd & activeUser?.isClassRep?

                <form className='cms-form cms-assign-form'>
                    <select  value={newExam.title} onChange={handleChange} name="title" id="module" className='cms-input-field cms-assign-field'>
                        <option value=""></option>
                        
                        {modules?.map((md)=>{
                            return(
                                <option key={md?._id} value={md?._id}>
                                    {md?.name}
                                </option>
                            )
                        })}
                    </select>

                    <input value={newExam.description}  onChange={handleChange} name='description' type="text" placeholder='Enter description' className='cms-input-field cms-assign-field' />
                    
                    <div className="cms-exam-time-fields">
                        
                        <input value={newExam.time.from} onChange={handleChangeTime} name="from" type="time" className='cms-input-field cms-assign-field' />
                        
                        <span style={{fontSize:"2rem"}}>:</span>
                        <input value={newExam.time.to} onChange={handleChangeTime} name='to' type="time" className='cms-input-field cms-assign-field' />

                    </div>
                
                    <input value={newExam.date}  onChange={handleChange} name="date" type="date" className='cms-input-field cms-assign-field' />
                        
                    <button onClick={createExam} className='cms-btn cms-create-assign-btn'>Create</button>
                
                </form>:

                <div className="cms-assignments-container">
                    {
                         exams?.map((md)=>{
                            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
                            return md?.exams?.map((exam, index)=>{

                                    const year = exam?.date?.slice(0, 4);
                                    const month = months[Number(exam?.date?.slice(5, 7)) -1 ];
                                    const day = exam?.date?.slice(8, 10);

                                    const dt2 = new Date(`${month} ${day}, ${year} ${exam?.time?.from+':00'}`);
                                    const dt1 = new Date();

                                return(
                                    <animated.div onMouseOver={()=>{handleToggleDescription(index)}} style={slideLeft} key={index} className="cms-today-cls  cms-assign-cls">
        

                                        <div className="cms-today-module-title-container">
                                                <h4 className='cms-today-module-title'>{md?.code?.toUpperCase()}</h4>
                                                <div className='cms-assignment-availability-container'>
                                                    <p>Active</p>
                                                    <div className="cms-today-module-availability"></div>
                                            
                                                </div>
                                               
                                        </div>

                                        

                                        <div className="cms--assignment-details-container">
                                                <p><strong>{exam?.task}</strong></p>
    
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

                                        {toggleDescription === index && <div className="cms-assignment-description-container">

                                            <p className="cms-assignment-description-text">{exam?.description}</p>
                                            <div className="cms-assignment-important-dates-container">
                                                <p>{exam?.date}</p>
                                                <p>{exam?.time?.from} - {exam?.time?.to}</p>   
                                            </div>
                                                
                                        </div>
        }
                                     
                                        
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

export default Exams