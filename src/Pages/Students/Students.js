import React, { useState } from 'react';
import './Students.css';
import { AccountCircle , Search, Add, Edit, Delete, Close} from '@mui/icons-material';
import {Formik} from 'formik';
import axios from 'axios';
import { appUrl } from '../../Helpers';
import { studentSchema } from '../../Components/Yup/Schema';
import {useDispatch, useSelector} from 'react-redux';
import {getStudents} from '../../State/StudentsSlice';
import {CircularProgress} from '@mui/material'
import { getPrograms } from '../../State/ProgramsSlice';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Loader from '../../Components/Loader/Loader';
import { message } from 'antd';
import MiniLoader from '../../Components/MiniLoader/MiniLoader';
import DialogBox from '../../Components/DialogBox/DialogBox';
import {animated, useSpring} from '@react-spring/web';
import studentsBackgroundImage from '../../Assets/students.jpg';


function StudentBox({slideLeft, student, activeUser, handleShowDeleteDialog, handleDisplayEdit}) {
  return (
        <animated.div style={{...slideLeft}}  key={student._id} className='class-student'>
            <div className="class-student-profile">
                <AccountCircle className='student-profile-icon other-student-icon'/>
                <p>{student?.username}</p>
                <p>{student?.regNO}</p>
            </div>

            { activeUser?.isClassRep && <div className="student-manage">
                <button onClick={()=> handleDisplayEdit(student._id)} className='student-manage-btn student-edit-btn'> <Edit className='edit-icon'/></button>
                <button onClick={()=>handleShowDeleteDialog(student?._id)} className='student-manage-btn student-remove-btn'> <Delete className='remove-icon' /></button>
            </div>}

        </animated.div>
  )
}



function Students() {
    const [deleteStudent, setDeleteStudent] = useState(undefined);
    const [displayAdd, setDisplayAdd] = React.useState(false);
    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [studentId, setStudentId] = React.useState('');
    const [search, setSearch] = React.useState('');
    const [programFilter, setProgramFilter] = React.useState('');
    const [studentsPage, setStudentsPage] = useState({
        startIndex:0,
        endIndex:10,
        page:1
    })

    const [student, setStudent] = React.useState({
        username:'',
        regNO:'',
        email:'',
        isClassRep:false
    });

    const [isLoading, setIsLoading] = React.useState(false);
    const [showMiniLoader, setShowMiniLoader] = useState(false);
    const [showDialogBox, setShowDialogBox] = useState(false);

    //active user

     const activeUser = useSelector(state => state.students.activeUser);

    //programs
    const foundPrograms = useSelector(state => state.programs.data);
    const programsStatus = useSelector(state => state.programs.status);
    const [programs, setPrograms] = React.useState();
    

    //students
    const dispatch = useDispatch();
    const allStudents = useSelector(state => state.students.data);
    const studentsStatus = useSelector(state => state.students.status);
    const [filterStudents, setFilterStudents] = React.useState();
    const [students, setStudents] = React.useState();

    //animations

    const [animating, setAnimating] = useState(false)
    let slideLeft = useSpring({
        from:{x:-100},
        to:{x:0},
       
        onRest:()=>{}
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

    function handleShowDeleteDialog(id){
        setShowDialogBox(prev => !prev);
        setDeleteStudent(id);
    }

    function handleDisplayAdd(){
        setDisplayAdd(prev => !prev);
    }

    function handleDisplayEdit(studentId){
        setDisplayEdit(prev => !prev);
        const fdStudent = students?.find((student)=> student._id === studentId);
        
        setStudentId(fdStudent?._id);
        setStudent(prev =>{
            return{
                username: fdStudent?.username,
                regNO: fdStudent?.regNO,
                email:fdStudent?.email,
                isClassRep:fdStudent?.isClassRep
            }
        });

    }

    function handleChangeStudent(e){
        setStudent(()=>{
        return{
            [e.target.name]:e.target.value
        }
    })}

    function handleChangePosition(e){
        setStudent(prev =>{
            return{
                ...prev,
                isClassRep:!prev?.isClassRep
            }
        })
    }

    function handleChangeSearch(e){
        setSearch(e.target.value);
    }

    async function addStudent(student){
        try {
            setShowMiniLoader(true);
            setIsLoading(true);
            setDisplayAdd(false);

            const response = await axios.post(`${appUrl}student`, student);
            const {data} = response;

            message.success('Successfully added a student');

            
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
            setTimeout(()=>{
                setShowMiniLoader(false);
            }, 3000);
        }
    }

    function handleSearch(){
        const foundStudents = allStudents?.filter((student)=>{
            const matchArg = new RegExp(search, 'ig');

            return student?.username.match(matchArg) || student?.regNO.match(matchArg)
        });
        
        setFilterStudents(foundStudents);
    }

    function handleFilterProgram(e){
        setProgramFilter(e.target.value);
        const newValue = e.target.value;
        const programStudents = allStudents?.filter((std)=>{
            if(newValue === 'all'){
                return std;
            }
            else{
                return std?.program === newValue;
            }
            
        })
        setStudents(prev =>{
            return [
                ...programStudents
            ]
        })

        setStudentsPage(prev  =>{
            return {
                ...prev,
                page:1,
                startIndex:0,
                endIndex:9
            }
        })
    }
    

    function handleSubmit(values, {resetForm}){
        
        addStudent(values);
        resetForm();
       // handleDisplayAdd();
    }

    function handlePagerBackward(){
        if(studentsPage.endIndex>9 && studentsPage.page > 1){
            setStudentsPage(prev =>{
                return{
                    ...prev,
                    page:prev.page-1,
                    startIndex:prev.startIndex-9,
                    endIndex:prev.endIndex-prev.startIndex>9?prev.endIndex-9: prev.endIndex-(prev.endIndex - prev.startIndex)
                }
            })
        }
    }

    function handlePagerForward(){
        if(studentsPage.endIndex < students?.length){
            setStudentsPage(prev =>{
                return{
                    ...prev,
                    page:prev.page+1,
                    startIndex:prev.endIndex,
                    endIndex:students?.length - prev.endIndex >= 9? prev.endIndex+9: students?.length
                }
            })
        }

    }

    async function removeStudent(){
        let studentId = deleteStudent;
        console.log(studentId);
        try {
            setIsLoading(true);
            setShowMiniLoader(true);

            const response = await axios.delete(`${appUrl}student/${studentId}`);
            const {data} = response;
            const studentsNow = students?.filter((student)=> student._id !== studentId);
            setStudents(studentsNow);
            message.success('Deleted student account');

            dispatch(getStudents());

        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
            setTimeout(()=>{
                setShowMiniLoader(false);
            }, 3000);
        }

    }

    async function updateStudent(studentId){
        try {
            setIsLoading(true);
            setShowMiniLoader(true);
            setDisplayEdit(false);
            const response = await axios.put(`${appUrl}student/${studentId}`, {username:student.username, regNO:student.regNO, email:student.email, isClassRep:student.isClassRep});
            const {data} = response;
            message.success('Successfully updated student account');
            
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
            setTimeout(()=>{
                setShowMiniLoader(false);
            }, 3000);
        }
    }

    React.useEffect(()=>{

        if(studentsStatus === 'idle'){
            dispatch(getStudents());
        }
        else if(filterStudents?.length){
            setStudents(filterStudents);
        }

        else if(!filterStudents?.length){
            setStudents(allStudents);
            
            // setStudent(filterStudents)
        }

        if(programsStatus === 'idle'){
            dispatch(getPrograms());
        }
        else if(programsStatus !== 'idle'){
            setPrograms(foundPrograms);
        }


        return ()=>{
            slideLeft = {};
        }


    }, [dispatch, studentsStatus, student, filterStudents, programsStatus, activeUser, animated]);


    if(studentsStatus === 'idle'){
        return <Loader/>
    }

  return (
    <div className=''>
        {
            showMiniLoader? <MiniLoader/>:<></>
        }

        {
            showDialogBox? <DialogBox message={"Are sure you want to permanently delete this student from CMS ?"} type={'danger'} handleConfirm={()=>{removeStudent()}} handleDeny={handleShowDeleteDialog} />:<></>
        }
        {
            displayAdd?
            <div className="add-window-container">
                
                <div onClick={handleDisplayAdd} className="close-icon-container">
                    <Close className='close-icon' />
                </div>

                <Formik
                    initialValues={{
                        username:'',
                        regNO:'',
                        email:'',
                        password:process.env.REACT_APP_DEFAULT_PWD, //hide
                        program:'',
                        isClassRep:false
                    }}

                    validationSchema={studentSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleChange, handleSubmit, values, errors, touched})=>(
                    <form noValidate onSubmit={handleSubmit} autoComplete='off' className="add-box">
                        <input name='username' id='username' value={values.username} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter student name' />
                        {touched.username && errors.username && <p className='error-text'>{errors.username}</p>}

                        <input name='email' id='email' value={values.email} onChange={handleChange} className='cms-field cms-add-student-field' type="email" placeholder='Enter student email' />
                        {touched.email && errors.email && <p className='error-text'>{errors.email}</p>}

                        <input name='regNO' id='regNO' value={values.regNO} onChange={handleChange} className='cms-field cms-add-student-field' type="text" placeholder='Enter student reg number' />
                        {touched.regNO && errors.regNO && <p className='error-text'>{errors.regNO}</p>}


                        <select name='program' value={values.program} onChange={handleChange} className='cms-field cms-add-student-field' >
                            <option value=""></option>
                            {programs?.map((program, index)=>{
                                return (
                                    <option key={index} value={program?._id}>{program?.name}</option>
                                )
                            })}
                           
                        </select>

                        <div className="cms-isClassrepContainer">
                            <input value={values.isClassRep} onChange={handleChange} id='classrep' name='isClassRep' className='checkPassword' type="checkbox" />
                            <label htmlFor="classrep">check if class rep</label>
                        </div>

                        <button  type='submit' className='cms-btn add-student-btn'> {isLoading? <CircularProgress className='cms-loader'/>: 'Add'}</button>
                    </form>

                    )}

                </Formik>
                
            </div>:
            <></>
        }

        {displayEdit?
            <div className="add-window-container">
                <div onClick={handleDisplayEdit} className="close-icon-container">
                    <Close className='close-icon' />
                </div>

                <form noValidate autoComplete='off' className="add-box">
                    <input name='username' id='username' value={student.username} onChange={handleChangeStudent} className='cms-field cms-add-student-field' type="text" placeholder='Enter student name' />
                    <input name='email' id='email' value={student.email} onChange={handleChangeStudent} className='cms-field cms-add-student-field' type="email" placeholder='Enter student email' />
                    <input name='regNO' id='regNO' value={student.regNO} onChange={handleChangeStudent} className='cms-field cms-add-student-field' type="text" placeholder='Enter student reg number' />
                        
                    <div className="cms-isClassrepContainer">
                            <input value={student?.isClassRep} onChange={handleChangePosition} checked={student?.isClassRep} id='classrep' name='isClassRep' className='checkPassword' type="checkbox" />
                            <label htmlFor="classrep">check if class rep</label>
                    </div>

                    <button onClick={()=>updateStudent(studentId)} type='button' className='cms-btn add-student-btn'> {isLoading? <CircularProgress className='cms-loader'/>: 'Update'}</button>
                </form>

            </div>
           :<></>}

            <div className="cms-students-background">

                <animated.div style={fadeIn} className="cms-students-text">
                    <h1 className='cms-students-title'>STUDENTS</h1>
                    <p className='cms-students-description'>Find who you are looking for</p>
                </animated.div>

                <animated.img style={fadeIn} src={studentsBackgroundImage} alt="" className='cms-module-backgroundImage' />
                <div className="video-background-overlay"></div>
            </div>

            <div className="class-students-panel">

                

                <div className="class-students-menu">
                    

                    <div className="class-student-search">

                        <input placeholder='Search students ...' value={search} onChange={handleChangeSearch} type="text" className='student-search-field' />
                        <button onClick={handleSearch}  className='student-search-btn'>
                            <Search  className='search-icon' />
                        </button>
                    </div>


                    <div className="cms-students-menu-extra">
                        <select value={programFilter} onChange={handleFilterProgram} className='cms-input-field cms-programs-select' name="" id="">
                            <option value="all">All</option>
                            {
                                programs?.map((program)=>{
                                    return(
                                        <option key={program?._id} value={program?._id}>{program?.code}</option>
                                    )
                                })
                            }
                        </select>

                        {activeUser?.isClassRep && <div onClick={handleDisplayAdd} className="add-student">
                            <Add className='add-icon' />
                        </div>}
                    </div>
                    



                </div>



                <div className="class-students-container">
                    {students?.slice(studentsPage.startIndex, studentsPage.endIndex)?.map((student)=>{

                        const {username, regNO} = student;
                        if(student?._id !== activeUser?._id){
                            return(
                               <StudentBox slideLeft={slideLeft} student={student} handleDisplayEdit={handleDisplayEdit} handleShowDeleteDialog={handleShowDeleteDialog} activeUser={activeUser} />
                            )
                    }
                    })}
                   

                </div>

                <div className="cms-students-page-num">
                    {
                        studentsPage.page
                    }
                </div>

                <div className="cms-students-container-pager-tabs">
                        <button onClick={handlePagerBackward} className='cms-btn'>
                            <ArrowBackIcon />
                        </button>
                        <button onClick={handlePagerForward} className='cms-btn'>
                            <ArrowForwardIcon className='' />
                        </button>
                 </div>
            
            </div> 

    </div>
  )
}

export default Students