import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { appUrl } from '../../Helpers';
import {message } from 'antd';
import MiniLoader from '../../Components/MiniLoader/MiniLoader';
// import {compare} from 'bcrypt'

import './Settings.css';
import SubNav from '../../Components/SubNav/SubNav';

function Settings() {

  //important datets
  const [schoolDates, setSchoolDates] = useState({
    openingDate:'',
    closingDate:'',
    startExams:'',
    endExams:'',
    startMidsemester:'',
    endMidsemester:''
  });

  //user
  const foundUser = useSelector(state => state.students.activeUser);
  const [isPreviousPWD, setIsPreviousPWD] = useState();
  const [passwordMatch, setPasswordMatch] =useState();

  const [user, setUser] = useState({
    username:'',
    regNO:''
  });

  //active user
  const activeUser = useSelector(state => state.students.activeUser);

  //password
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  //loader
  const [showMiniLoader, setShowMiniLoader] = useState(false);

  function handleChangePassword(e){
    setPassword(e.target.value);
  }

  function handleConfirmPassword(e){
    setConfirmPassword(e.target.value)
  }

  function handleNewPassword(e){
    setNewPassword(e.target.value);
  }

  function handleChangeDates(e){
    setSchoolDates(prev =>{
      return{
        ...prev,
        [e.target.name]:e.target.value
      }
    })
  }

  function handleChange(e){
  
    setUser(prev => {
      return {
        ...prev,
        [e.target.name]:e.target.value
      }
    })
  }

  async function handleSetSchoolDatesAPI(){
    try {
      setShowMiniLoader(true);
      const response = await axios.get(`${appUrl}settings`);
      const {data} = response;
      if(data?.length){
        console.log(data[0]);
        setSchoolDates(data[0]);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setShowMiniLoader(false);
    }
  }

  async function updateSchoolDates(){
    try {
     
      if(schoolDates?.closingDate && schoolDates?.openingDate && schoolDates?.startExams && schoolDates?.endExams){
        
        setShowMiniLoader(true);
        const response = await axios.get(`${appUrl}settings`);
        const {data} = response;

        if(data?.length){
          await axios.put(`${appUrl}settings/${schoolDates?._id}`, {...schoolDates});

        }else{
          await axios.post(`${appUrl}settings`, {...schoolDates});
        }
      }
      
    } catch (error) {
      console.log(error);
    }finally{
      setTimeout(()=>{
        setShowMiniLoader(false);
      }, 3000)
    }
  }

  async function updateUser (){
    try {
      setShowMiniLoader(true);
      const response = await axios.put(`${appUrl}student/${user?._id}`, {...user, username:user?.username, regNO:user?.regNO});
      const {data} = response;
      setUser(data);
      message.success("Updated user successfully");
    } catch (error) {
      console.log(error);
    }finally{
      setTimeout(()=>{
        setShowMiniLoader(false);
      }, 3000);
    }
  }

  async function updatePassword(){
    try {
      if(newPassword?.length >= 7){
        if(isPreviousPWD && passwordMatch){
          const response = await axios.put(`${appUrl}student/${user?._id}`, {password:newPassword});
          const {data} = response;
          setUser(data);
          message.success("changed password successfully");
        }
      }else{
        message.error('Enter at least 7 characters');
      }
      

      
    } catch (error) {
      console.log(error);
    }
  }

async function verifyPWD(user){

  // const isMatch = await compare(password, user?.password);
  try {
    const response = await axios.post(`${appUrl}student/signin`, {email:user?.email, password:password});
    const {data} = response;

    setIsPreviousPWD(true);
    
  } catch (error) {
  
    setIsPreviousPWD(false);
    console.log(error);
  }

}
  
  useEffect(()=>{

    setPasswordMatch(prev =>{
      const passwordMatch = newPassword === confirmPassword?true:false;
      return passwordMatch
      
    });
   
    if(foundUser){
      setUser(foundUser);
      verifyPWD(foundUser)
      
    }

    handleSetSchoolDatesAPI();

  }, [foundUser, password, confirmPassword]);

  
  return (
    <div className='cms-settings-container'>

      {
        showMiniLoader?<MiniLoader/> :<></>
      }

      <SubNav page={'Settings'} pageIcon={'fa-gear'}/>

      <br /><br />
        
        
        <form className='cms-form cms-settings-form cms-assign-form'>
                    {activeUser?.isClassRep && <div style={{display:"flex", flexDirection:"column", gap:"1em"}}>
                      <h4>School Important Dates</h4>

                      <label htmlFor="openingDate">Opening Date</label>
                      <input value={schoolDates?.openingDate}  onChange={handleChangeDates} name='openingDate' type="date" className='cms-input-field cms-assign-field' />

                      <div className="cms-school-dates-exams-container">
                        <div className='cms-school-dates-exam'>
                          <label htmlFor="startMidsemester">Start Mid-Semester</label>
                          <input value={schoolDates?.startMidsemester}  onChange={handleChangeDates} name='startMidsemester' type="date" className='cms-input-field cms-assign-field' />
                        
                        </div>

                        <div className='cms-school-dates-exam'>
                          <label htmlFor="endMidsemester">End Mid-Semester</label>
                          <input value={schoolDates?.endMidsemester}  onChange={handleChangeDates} name='endMidsemester' type="date" className='cms-input-field cms-assign-field' />
                        </div>

                      </div>

                      <div className="cms-school-dates-exams-container">
                        <div className='cms-school-dates-exam'>
                          <label htmlFor="startExams">Start Exams</label>
                          <input value={schoolDates?.startExams}  onChange={handleChangeDates} name='startExams' type="date" className='cms-input-field cms-assign-field' />
                        
                        </div>

                        <div className='cms-school-dates-exam'>
                          <label htmlFor="endExams">End Exams</label>
                          <input value={schoolDates?.endExams}  onChange={handleChangeDates} name='endExams' type="date" className='cms-input-field cms-assign-field' />
                        </div>

                      </div>

                      <label htmlFor="closingDate">Closing Date</label>
                      <input value={schoolDates?.closingDate}  onChange={handleChangeDates} name="closingDate" type="date" className='cms-input-field cms-assign-field' />
                        
                      <button type='button' onClick={updateSchoolDates} className='cms-btn cms-btn-save cms-create-assign-btn'>Save</button>

                      <hr className='hr' />

                    </div>}


                    <h4>Student Details</h4>
 
                    <input value={user?.username}  onChange={handleChange} name='username' type="text" placeholder='Enter name' className='cms-input-field cms-assign-field' />
                    
      
                    <input value={user?.regNO}  onChange={handleChange} name="regNO" type="text" placeholder='Enter reg NO' className='cms-input-field cms-assign-field' />
                      
                    <button type='button' onClick={updateUser} className='cms-btn cms-btn-save cms-create-assign-btn'>Save</button>
                    <hr className='hr' /> 

                    <h4>Security</h4>

                    <input value={password} onChange={handleChangePassword}  name="password" placeholder='Enter previous password' type="password" className={`${isPreviousPWD ?'cms-password-match':'cms-password-diff'} cms-input-field cms-assign-field`} />
                    
                    <input value={newPassword} onChange={handleNewPassword} disabled={isPreviousPWD?false:true}  name="password" placeholder='Enter new password' type="password" className={`${isPreviousPWD?'cms-password-match':''} cms-input-field cms-assign-field`}/>
                      
                    <input value={confirmPassword} onChange={handleConfirmPassword}   name="text" placeholder='Confirm password' type="password" className={`${passwordMatch && newPassword?'cms-password-match': newPassword?'cms-password-diff':''} cms-input-field cms-assign-field`} />
                  

                    <button type='button' disabled={!(isPreviousPWD && passwordMatch)} onClick={updatePassword} className='cms-btn cms-btn-save cms-create-assign-btn'>Confirm</button>
                    
                
        </form>

    </div>
  )
}

export default Settings