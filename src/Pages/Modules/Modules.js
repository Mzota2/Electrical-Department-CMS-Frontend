import React, { useState } from 'react';
import './Modules.css';
import { useSelector, useDispatch } from 'react-redux';
import { getModules } from '../../State/ModulesSlice';
import { getPrograms } from '../../State/ProgramsSlice';
import {getStudents, setActive} from '../../State/StudentsSlice'
import { appUrl } from '../../Helpers';
import axios from 'axios';
import { moduleSchema } from '../../Components/Yup/Schema';
import {Formik} from 'formik'
import {CircularProgress} from '@mui/material'
import {Add, Close, Remove, RemoveCircleOutline, AddCircleOutline} from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moduleBackgroundImage from '../../Assets/modules.jpg';
import ModuleMenu from '../../Components/ModuleMenu/ModuleMenu';
import { message } from 'antd';
import MiniLoader from '../../Components/MiniLoader/MiniLoader';
import DialogBox from '../../Components/DialogBox/DialogBox';
import { animated, useSpring } from '@react-spring/web';

function Modules() {
  //active tab

  const [activeTab, setActiveTab] = React.useState('My Modules');

  //modulw options
  const [displayModuleOptions, setDisplayModuleOptions] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');
  const [deletedModule, setDeletedModule] = useState(undefined);

  //DOM
  const [viewEditModule, setViewEditModule] = React.useState(false);
  const [viewAddModule, setViewModule] = React.useState(false);
  const [user, setUser] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showMiniLoader, setShowMiniLoader] = useState(false);
  const [showDialogBox, setShowDialogBox] = useState(false);

  const [classDays, setClassDays] = React.useState([{
    from:'00:00',
    to:'00:00',
    room:'',
    day:'Monday',
    isCancelled:false
  },{
    from:'',
    to:'',
    room:'',
    day:'Monday',
    isCancelled:false
  },{
    from:'',
    to:'',
    time:'',
    room:'',
    day:'Monday',
    isCancelled:false
  }]);
  const [daysNum, setDaysNum] = React.useState(1);
  const [isViewDepartment, setIsViewDepartment] = React.useState(false);

  const activeUser = useSelector(state => state.students.activeUser);//gets active user

  const dispatch = useDispatch();

  //all students

  const foundStudents = useSelector(state => state.students.data);
  const studentsStatus = useSelector(state => state.students.status);
  const studentModules = useSelector(state => state.students.modules);
  const activeStudent = useSelector(state => state.students.activeUser);
  const [students, setStudents] = React.useState();

  //programs status
  const foundPrograms = useSelector(state => state.programs.data);
  const programsStatus = useSelector(state => state.programs.status);
  const [program, setProgram] = React.useState();

  //modules status
  let foundModules = useSelector(state => state.modules.data);
  const modulesStatus = useSelector(state => state.modules.status);
  const [modules, setModules] = React.useState();

  //edit module
  const [moduleData, setModuleData] = React.useState();

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


  //DOM Functions

  function handleActiveTab(e){
    setActiveTab(e.target.innerText);
  }

  function handleDisplayEditModule(id){
    const currentModule = modules?.find((md => md?._id === id));
    setModuleData(currentModule);

    setClassDays(prev =>[...currentModule?.classDays]);
    setDaysNum(currentModule?.classDays?.length)

    handleViewEditModule();

  }

  function handleDisplayModuleOptions(id){
    setDisplayModuleOptions(prev => !prev);
    setSelectedModule(id);
  }

  function handleViewEditModule(){
    setViewEditModule(prev => !prev);
  }
  function handleViewAddModule(){
    setViewModule(prev => !prev);
  }

  function handleMyModules(e){
    console.log(activeUser)
    //activateTab
    handleActiveTab(e);
    setIsViewDepartment(false);
    //get all my modules
    const myModules = user?.modules?.map((myModule)=>{
      const existingModule = foundModules?.find(md => md._id === myModule);
      if(existingModule){
        console.log(existingModule);
        console.log('found');
        return existingModule;

      }
     
    
    })?.filter((md)=> md); //check if its defined

    console.log(myModules);

    setModules(myModules);
 
  }

  function handleAllModules(e){
    handleActiveTab(e)
    setIsViewDepartment(false);
    const allModules = foundModules?.filter((md)=>{
      return md?.programsId.find((pg)=> pg === user?.program); //find the modules in that program
    });

    console.log(allModules);
    setModules(allModules);

  }

  function handleDepartmentModules(e){
    handleActiveTab(e); //activate tab
    setIsViewDepartment(true);
    setModules(foundModules);
  }

  function handleUpdateModule(values){

    const currentModule = {...values, classDays};
    editModule(currentModule, currentModule?._id);
  }

  //editing a module
  async function editModule(module, id){
    try {
      setShowMiniLoader(true);
      const response = await axios.put(`${appUrl}module/${id}`, module);
      const {data} = response;
      
    } catch (error) {
      console.log(error);
    }finally{
      setTimeout(()=>{
        setShowMiniLoader(false);
      }, 3000)
    }
  }

  //updateStudents
  async function updateStudent(id, student){
    try {

      const response = await axios.put(`${appUrl}student/${id}`, student);

      const {data} = response;
      console.log(data);

    } catch (error) {
      console.log(error);
    }
  }

  //deleting a module
  async function deleteModule(){
    let id = deletedModule;

    try {
      setShowMiniLoader(true);
      const selectedModule = modules?.find((md)=> md?._id === id);

      const response = await axios.delete(`${appUrl}module/${id}`);
      const {data} = response;
      console.log(data);

      //remove in my modules

      students?.map((student)=>{
        const foundModule = student?.modules?.find((md)=> md === id);
        if(foundModule){
          //delete the module

          const remainingModules = student?.modules?.filter((md=> md !== id));
          const currentStudent = {...student, modules:remainingModules};
          updateStudent(student?._id, currentStudent);

        }
      });

      dispatch(getModules());

      message.success(`Deleted ${selectedModule?.name}`);

      
    } catch (error) {
      console.log(error);
    }
    finally{
      setTimeout(()=>{
        setShowMiniLoader(false);
      }, 3000)
    }
  }

  function handleShowDeleteDialog(id){
    setShowDialogBox(prev => !prev);
    setDeletedModule(id);
    console.log(id);
  }
  
  async function createModule(module){
    try {
      setShowMiniLoader(true);
        //classDays
      setIsLoading(true);
      //class days
      const moduleDays = classDays.slice(0, daysNum);


      const response = await axios.post(`${appUrl}module`, {...module, classDays:moduleDays});
      const {data} = response;
     
      handleAdd(data?._id, module); //added created module to my modules
      message.success(`Successfully added ${module?.name}`);

    } catch (error) {
      console.log(error);
    }
    finally{
      setIsLoading(false);
      setTimeout(()=>{
        setShowMiniLoader(false);
      }, 3000)
    }

  }

  async function handleEnroll(id){
    try {
      setShowMiniLoader(true);
      const studentModules =user?.modules?user?.modules.concat(id):[id];
      const selectedModule = modules?.find((md)=> md?._id === id);

      const response = await axios.put(`${appUrl}student/${user?._id}`, {...user, modules:studentModules});
      const {data} = response;
      //console.log(data);
      localStorage.setItem('cms-user', JSON.stringify(data));
      dispatch(setActive(data));

      message.success(`Enrolled in ${selectedModule?.name}`)
      
    } catch (error) {
      console.log(error);
    }finally{
      setTimeout(()=>{
        setShowMiniLoader(false);
      }, 3000)
    }
  }

  async function handleLeave(id){
    try {
      setShowMiniLoader(true);
      const studentModules = user?.modules?.filter((md)=> md !== id);
      const selectedModule = modules?.find((md)=> md?._id === id);

      const response = await axios.put(`${appUrl}student/${user?._id}`, {...user, modules:studentModules});
      const {data} = response;
      localStorage.setItem('cms-user', JSON.stringify(data));
      dispatch(setActive(data));

      message.success(`Left ${selectedModule?.name}`)
      
    } catch (error) {
      console.log(error);
    }
    finally{
      setTimeout(()=>{
        setShowMiniLoader(false);
      }, 3000)
    }

  }

  async function handleAdd(id, module){
    try {
      setShowMiniLoader(true);
      let selectedModule = modules?.find((md)=> md?._id === id);
      const modulePrograms = selectedModule?.programsId? selectedModule.programsId?.concat(user?.program):[user?.program];

      //sends request to backend
      await axios.put(`${appUrl}module/${id}`, {...selectedModule, programsId:modulePrograms});
     
      dispatch(getModules()); //get updated modules list
    
      message.success(`Added ${module?.name} to ${program?.code}`)
      
    } catch (error) {
      console.log(error);
    }finally{
      setTimeout(()=>{
        setShowMiniLoader(false);
      }, 3000)
     
    }
  }

  async function handleRemove(id){
    try {
      setShowMiniLoader(true);
      const selectedModule = modules?.find((md)=> md?._id === id);
      const modulePrograms = selectedModule?.programsId?.filter((pg)=> pg !== user?.program);
    
      const response = await axios.put(`${appUrl}module/${id}`, {...selectedModule, programsId:modulePrograms});
      const {data} = response;

      message.success(`Removed ${selectedModule?.name} from ${program?.code}`)

      //remove modules in the array

      //remaining modules

      dispatch(getModules()); //get updated modules list'
      handleLeave(id);
    
    } catch (error) {
      console.log(error);
    }finally{
      setTimeout(()=>{
        setShowMiniLoader(false);
      }, 3000)
    }
    

  }

  function handleSubmit(values,{resetForm}){
    createModule(values);
    resetForm();

  }

  function handleChangeTime(e, index, pos){

    const updateTime = classDays?.find((md, ind)=> ind === index);
    const newTime = {...updateTime};
    newTime[pos] = e.target.value;

    classDays[index] = newTime;
    
    const updatedClass = [...classDays];
    setClassDays(prev=>{
      return[
        ...updatedClass
  
      ]
    });
  }
  function handleChangeDay(e, index){
    const updateTime = classDays?.find((md, ind)=> ind === index);
    const newDay = {...updateTime};
    newDay.day = e.target.value;
    classDays[index] = newDay;
    const updatedClass = [...classDays];
    setClassDays(prev=>{
      return[
        ...updatedClass
  
      ]
    });
    
    console.log(classDays);
  }

  function handleChangeRoom(e, index){
    const updateTime = classDays?.find((md, ind)=> ind === index);
    const newRoom = {...updateTime};
    newRoom.room = e.target.value;
    classDays[index] = newRoom;
    const updatedClass = [...classDays];
    setClassDays(prev=>{
      return[
        ...updatedClass
  
      ]
    });
  }

  function handleIncrementDays(){

    if(daysNum < 3){
      if(classDays?.length < 3){
        setClassDays(prev => prev.concat({
          from:'00:00',
          to:'00:00',
          room:'',
          day:'Monday',
          isCancelled:false
        }));
      }
      setDaysNum(prev => prev+1);
    }
    else{
      setDaysNum(3);
    }
   
  }

  function handleDecrementDays(){
    if(daysNum >1){
      setDaysNum(prev => prev-1);
    }
    else{
      setDaysNum(1);
    }
  }


  React.useEffect(()=>{

    if(modulesStatus === 'idle'){
      dispatch(getModules());
    }

    else if(modulesStatus !== 'idle'){
      // setModules(foundModules);
      if(activeTab === 'My Modules' && activeStudent){
           //get all my modules
         setModules(studentModules);
      }

      else if(activeTab === 'Department'){
       
         setModules(foundModules);
      }

      else if(activeTab === 'Program'){
        const allModules = modules?.filter((md)=>{
          return md?.programsId.find((pg)=> pg === user?.program); //find the modules in that program
        });
        setModules(allModules);
      }
  
    }

    if(programsStatus === 'idle'){
      dispatch(getPrograms());
    }
    else if(programsStatus !== 'idle' ){
      const userProgram = foundPrograms?.find((program)=> program._id === user?.program);
      setProgram(userProgram);
  
    }

    if(studentsStatus  === 'idle'){
      dispatch(getStudents());
    }

    else if(studentsStatus !== 'idle'){
      setStudents(foundStudents);
    }
    
    setUser(activeUser);

  }, [dispatch, modulesStatus, activeUser, programsStatus, foundModules, studentsStatus, foundStudents]);

  return (
    <div className='container'>

     
      {showDialogBox?<DialogBox type={'danger'} message={'Are you sure you want to permanently delete this module ?'} handleDeny={()=>{handleShowDeleteDialog(selectedModule)}} handleConfirm={()=>{deleteModule()}}/>
       :<></>}

      {
        showMiniLoader?<MiniLoader/>:<></>
      }
        {
            viewAddModule?
            <div className="add-window-container">
                
                <div onClick={handleViewAddModule} className="close-icon-container">
                    <Close className='close-icon' />
                </div>

                <Formik
                    initialValues={{
                        programsId:[user?.program],
                        name:'',
                        code:'',
                        lecturer:'',
    
                    }}

                    validationSchema={moduleSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleChange, handleSubmit, values, errors, touched})=>(
                    <form noValidate onSubmit={handleSubmit} autoComplete='off' className="add-box">
                        <input name='name' id='name' value={values.name} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module name' />
                        {touched.name && errors.name && <p className='error-text'>{errors.name}</p>}

                        <input name='code' id='code' value={values.code} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module code' />
                        {touched.code && errors.code && <p className='error-text'>{errors.code}</p>}

                        <input name='lecturer' id='lecturer' value={values.lecturer} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module lecturer' />
                        {touched.lecturer && errors.lecturer && <p className='error-text'>{errors.lecturer}</p>}


                        <hr className='hr'/>
                        <div className='cms-module-days-container'>
                          <h5>Class details</h5>
                          
                          <div className="cms-module-dayrs-row">

                            <div className="cms-module-dayrs-time-row">
                             
                              <input value={classDays[0].from} onChange={(e)=>{handleChangeTime(e, 0, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                              <h1 htmlFor="time">:</h1>
                              <input value={classDays[0].to} onChange={(e)=>{handleChangeTime(e, 0, 'to')}} type="time" className='cms-field cms-add-student-field'/>
   
                            </div>
                           
                            <div className="cms-module-dayrs-time-row">

                              <select value={classDays[0].day} onChange={(e)=>{handleChangeDay(e, 0)}} className='cms-field cms-add-student-field' name="days" id="days">
                                  <option value="Monday">Monday</option>
                                  <option value="Tuesday">Tuesday</option>
                                  <option value="Wednesday">Wednesday</option>
                                  <option value="Thursday">Thursday</option>
                                  <option value="Friday">Friday</option>
                              </select>

                              <input value={classDays[0].room} placeholder='Enter room' onChange={(e)=>{handleChangeRoom(e, 0)}} type="text" className='cms-field cms-add-student-field' />


                            </div>
                           
                          </div>

                         {daysNum >=2 && <div className="cms-module-dayrs-row">

                          <div className="cms-module-dayrs-time-row">
                            <input value={classDays[1].from} onChange={(e)=>{handleChangeTime(e, 1, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                            <h1 htmlFor="time">:</h1>
                            <input value={classDays[1].to} onChange={(e)=>{handleChangeTime(e, 1, 'to')}} type="time" className='cms-field cms-add-student-field'/>

                          </div>

                          <div className="cms-module-dayrs-time-row">

                            <select value={classDays[1].day} onChange={(e)=>{handleChangeDay(e, 1)}} className='cms-field cms-add-student-field' name="days" id="days">
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                            </select>

                            <input value={classDays[1].room} placeholder='Enter room' onChange={(e)=>{handleChangeRoom(e, 1)}} type="text" className='cms-field cms-add-student-field' />


                          </div>

                          </div>}

                          
                         {daysNum >= 3 && <div className="cms-module-dayrs-row">

                              <div className="cms-module-dayrs-time-row">
                                <input value={classDays[2].from} onChange={(e)=>{handleChangeTime(e, 2, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                                <h1 htmlFor="time">:</h1>
                                <input value={classDays[2].to} onChange={(e)=>{handleChangeTime(e, 2, 'to')}} type="time" className='cms-field cms-add-student-field'/>

                              </div>

                              <div className="cms-module-dayrs-time-row">

                                <select value={classDays[2].day} onChange={(e)=>{handleChangeDay(e, 2)}} className='cms-field cms-add-student-field' name="days" id="days">
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                </select>

                                <input value={classDays[2].room} onChange={(e)=>{handleChangeRoom(e, 2)}} placeholder='Enter room' type="text" className='cms-field cms-add-student-field' />


                              </div>

                              </div>
                                  }

                          <div className="cms-add-module-control-btns">

                            <div className="cms-add-days-container cms-select-btn cms-enroll-btn">

                            <Add onClick={handleIncrementDays} className='cms-add-days' />
                            </div>

                            <div className="cms-add-days-container cms-select-btn cms-leave-btn cms-remove-btn">
                            <Remove onClick={handleDecrementDays} className='cms-add-days' />
                            </div>

                          </div>

                        
                        </div>

                        <button  type='submit' className='cms-btn add-student-btn'>Add</button>
                    </form>

                    )}

                </Formik>
                
            </div>:
            <></>
        }

        {
            viewEditModule?
            <div className="add-window-container">
                
                <div onClick={handleViewEditModule} className="close-icon-container">
                    <Close className='close-icon' />
                </div>

                <Formik
                    initialValues={
                     {
                      ...moduleData,
                     
                     }
                    }

                    validationSchema={moduleSchema}
                    onSubmit={handleUpdateModule}
                >
                    {({ handleChange, handleSubmit, values, errors, touched})=>(
                    <form noValidate onSubmit={handleSubmit} autoComplete='off' className="add-box">
                        <input name='name' id='name' value={values.name} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module name' />
                        {touched.name && errors.name && <p className='error-text'>{errors.name}</p>}

                        <input name='code' id='code' value={values.code} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module code' />
                        {touched.code && errors.code && <p className='error-text'>{errors.code}</p>}

                        <input name='lecturer' id='lecturer' value={values.lecturer} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter module lecturer' />
                        {touched.lecturer && errors.lecturer && <p className='error-text'>{errors.lecturer}</p>}

                        <div className='cms-module-days-container'>
                          <label htmlFor="days">Class Time</label>
                          <br />
                          <div className="cms-module-dayrs-row">

                            <div className="cms-module-dayrs-time-row">
                              <label htmlFor="time">From</label>
                              <input value={classDays[0].from} onChange={(e)=>{handleChangeTime(e, 0, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                              <label htmlFor="time">To</label>
                              <input value={classDays[0].to} onChange={(e)=>{handleChangeTime(e, 0, 'to')}} type="time" className='cms-field cms-add-student-field'/>
   
                            </div>
                           
                            <div className="cms-module-dayrs-time-row">

                              <select value={classDays[0].day} onChange={(e)=>{handleChangeDay(e, 0)}} className='cms-field cms-add-student-field' name="days" id="days">
                                  <option value="Monday">Monday</option>
                                  <option value="Tuesday">Tuesday</option>
                                  <option value="Wednesday">Wednesday</option>
                                  <option value="Thursday">Thursday</option>
                                  <option value="Friday">Friday</option>
                              </select>

                              <input value={classDays[0].room} onChange={(e)=>{handleChangeRoom(e, 0)}} type="text" className='cms-field cms-add-student-field' />


                            </div>
                           
                          </div>

                         {daysNum >=2 && <div className="cms-module-dayrs-row">

                          <div className="cms-module-dayrs-time-row">
                            <label htmlFor="time">From</label>
                            <input value={classDays[1].from} onChange={(e)=>{handleChangeTime(e, 1, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                            <label htmlFor="time">To</label>
                            <input value={classDays[1].to} onChange={(e)=>{handleChangeTime(e, 1, 'to')}} type="time" className='cms-field cms-add-student-field'/>

                          </div>

                          <div className="cms-module-dayrs-time-row">

                            <select value={classDays[1].day} onChange={(e)=>{handleChangeDay(e, 1)}} className='cms-field cms-add-student-field' name="days" id="days">
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                            </select>

                            <input value={classDays[1].room} onChange={(e)=>{handleChangeRoom(e, 1)}} type="text" className='cms-field cms-add-student-field' />


                          </div>

                          </div>}

                          
                         {daysNum >= 3 && <div className="cms-module-dayrs-row">

                              <div className="cms-module-dayrs-time-row">
                                <label htmlFor="time">From</label>
                                <input value={classDays[2].from} onChange={(e)=>{handleChangeTime(e, 2, 'from')}} type="time" className='cms-field cms-add-student-field'/>
                                <label htmlFor="time">To</label>
                                <input value={classDays[2].to} onChange={(e)=>{handleChangeTime(e, 2, 'to')}} type="time" className='cms-field cms-add-student-field'/>

                              </div>

                              <div className="cms-module-dayrs-time-row">

                                <select value={classDays[2].day} onChange={(e)=>{handleChangeDay(e, 2)}} className='cms-field cms-add-student-field' name="days" id="days">
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                </select>

                                <input value={classDays[2].room} onChange={(e)=>{handleChangeRoom(e, 2)}} type="text" className='cms-field cms-add-student-field' />


                              </div>

                              </div>
                                  }



                          {daysNum < 3 && <div className="cms-add-days-container">
                            <Add onClick={handleIncrementDays} className='cms-add-days' />
                          </div>}

                          <div className="cms-add-days-container">
                            <Remove onClick={handleDecrementDays} className='cms-add-days' />
                          </div>

                        </div>

                        <button  type='submit' className='cms-btn add-student-btn'>Edit</button>
                    </form>

                    )}

                </Formik>
                
            </div>:
            <></>
        }
        
        <div className="cms-students-background">
          
          <animated.div style={fadeIn} className="cms-students-text">
              <h1 className='cms-students-title'>MODULES</h1>
              <p className='cms-students-description'>Find your modules</p>
          </animated.div>

          <animated.img style={fadeIn} src={moduleBackgroundImage} alt="" className='cms-module-backgroundImage' />
          <div style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}} className="video-background-overlay"></div>
        </div>
     
      <div className="class-modules-container">

          <div className="class-module-tabs-container">
                <button onClick={handleMyModules} className={`${activeTab === 'My Modules' ? 'activate-tab':'class-module-tab'} class-module-tab`}>My Modules</button>
                <button onClick={handleAllModules} className={`${activeTab === 'Program' ? 'activate-tab':'class-module-tab'} class-module-tab`}>Program</button>
    
                {activeStudent?.isClassRep && <button onClick={handleDepartmentModules} className={`${activeTab === 'Department' ? 'activate-tab':'class-module-tab'} class-module-tab`}>Department</button>
                }
                {activeStudent?.isClassRep && <div onClick={handleViewAddModule} className="add-student cms-add-module-btn">
                        <Add className='add-icon' />
                </div>}
          
          </div>

          <div className="class-modules-window">
            {
              isViewDepartment?
              modules?.map((module)=>{
                const isFound = module?.programsId?.find(id => id === user?.program);
  
                // const {name, code, lecturer} = module;
                return(
                  <div style={{borderBottom:`${isFound? '2px dashed var(--light-blue)':''}`}} className='cms-class-module' key={module?._id}>
                        <p className='cms-today-name'>{module?.name}</p>
                        <p className='cms-today-code'>{module?.code}</p>
                        <p className='cms-today-lecturer'>{module?.lecturer}</p>


                      <div onClick={()=>{handleDisplayModuleOptions(module?._id)}} className="cms-module-options-icon-container">
                        <MoreVertIcon  className='cms-module-options-icon'/>
                      </div>

                      {displayModuleOptions && selectedModule===module?._id?<ModuleMenu display={displayModuleOptions} handleDisplay={handleDisplayModuleOptions} isFound={isFound} handleEdit={()=>{handleDisplayEditModule(module?._id)}} handleRemove={()=>{handleRemove(module?._id)}} handleAdd={()=>{handleAdd(module?._id, module)}} handleDelete={(id)=>{
                        id = module?._id
                        handleShowDeleteDialog(id)}} id={module?._id} />:<></>}
                  </div>
                )
              }):modules?.map((module)=>{
                const isFound = user?.modules.find((md)=> md === module?._id);
    
                // const {name, code, lecturer} = module;
                return(
                  <div className='cms-class-module cms-home-today' key={module?._id}>
                       <p className='cms-today-name'>{module?.name}</p>
                        <p className='cms-today-code'>{module?.code}</p>
                        <p className='cms-today-lecturer'>{module?.lecturer}</p>
                      <div className="cms-class-module-controllers">
                        {
                          isFound? <button  onClick={()=>{handleLeave(module?._id)}} className='cms-select-btn cms-leave-btn'><RemoveCircleOutline/></button>:
                          <button onClick={()=>{handleEnroll(module?._id)}} className='cms-select-btn cms-enroll-btn'><AddCircleOutline/></button>
                        }
                        
                      </div>
    
    
                  </div>
                )
              })
            }

          </div>

      </div>
  
    </div>
  )
}

export default Modules