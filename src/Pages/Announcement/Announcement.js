import React, { useEffect, useState } from 'react'
import './Announcement.css';
import SubNav from '../../Components/SubNav/SubNav';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import chatback from '../../Assets/chatback.jpg';
import {getAnnouncements} from '../../State/AnnouncementsSlice';
import { appUrl } from '../../Helpers';
import Loader from '../../Components/Loader/Loader';
import  {message} from 'antd';

function Announcement() {

    //active user
    const activeUser= useSelector(state=> state.students.activeUser);

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    //announcements
    const foundAnnouncements = useSelector(state => state.announcements.data);
    const announcementsStatus = useSelector(state => state.announcements.status);
    const [announcements, setAnnouncements] = useState();
    const [isEditAnno, setEditAnno] = useState(false);

    //current message
    const [currentMessage, setCurrentMessage] = useState({});


    //create announcement
    const [mAnnouncement, setMannouncement] = useState({
        agenda:'',
        description:'',
        date:'',
        time:'',
        duration:{
            type:'',
            value:0
        }
     
    });

    

    const dd = new Date();
    let month = dd.getMonth();

    const dayOfYear = date => Math.floor((date - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

    function getNumberOfWeek() {
        const today = new Date();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    async function removeInvalidAnnouncements(){
        try {
            if(announcements?.length){
                announcements?.map(async(anno)=>{
                  if(anno?.duration?.type === 'day' && anno?.duration?.value <= dayOfYear(new Date(dd?.getFullYear()+'-'+(dd?.getMonth()+1)+'-'+dd?.getDate()))-1){
                    await axios.delete(`${appUrl}announcement/${anno?._id}`);
                  }

                  else if( anno?.duration?.type=== 'week' && anno?.duration?.value <= getNumberOfWeek()){
                    await axios.delete(`${appUrl}announcement/${anno?._id}`);
                  }

                  else if(anno?.duration?.type=== 'month' && anno?.duration?.value <= month){
                    await axios.delete(`${appUrl}announcement/${anno?._id}`);
                  }
                
                });
            }
            
        } catch (error) {
            console.log(error);
        }

    }


    function handleChange(e){
        setMannouncement(prev =>{
            return{
                ...prev,
                [e.target.name]:e.target.value
            }
        });
    }

    function handleChangeDuration(e){
        setMannouncement(prev =>{
            return {
                ...prev,
                duration:{
                    ...prev.duration,
                    type:e.target.value,
                    value:e.target.value === 'day'?
                        dayOfYear(new Date(dd?.getFullYear()+'-'+(dd?.getMonth()+1)+'-'+dd?.getDate()))+1:
                            e.target.value === 'week'?
                            getNumberOfWeek()+1:
                                e.target.value === 'month'?
                                month+1:
                                    0
                }
            }
        })
    }

    function setTime(){
        const date = new Date();
        const time = date.toLocaleTimeString();
        return time;
    }

    function setDate(){
        const date = new Date();
        const today = date.toDateString();
        console.log(today);
        return today;
    }


    async function makeAnnouncement(){
        try {
            if(mAnnouncement.duration?.type?.length && mAnnouncement?.agenda?.length && mAnnouncement?.description?.length){
                await axios.post(`${appUrl}announcement`, {...mAnnouncement, time:setTime(), date:setDate()});
                setMannouncement({
                    agenda:'',
                    description:'',
                    date:'',
                    time:'',
                    duration:{
                        type:'',
                        value:0
                    }
                });

                dispatch(getAnnouncements());
            }

            else{
                message.error("You have empty fields");
            }

            console.log(mAnnouncement);
            
        } catch (error) {
            console.log(error);
        }
       
    }

    function handleSetEditAnnouncement(annoId){
        const foundAnno = announcements?.find((anno)=> anno?._id === annoId);
        if(foundAnno){
            setMannouncement(foundAnno);
            setEditAnno(true);
        }

        else{
            console.log("annoucement not found");
        }

    }

    async function handleEditAnnouncement(annoId){
        try {
            const response = await axios.put(`${appUrl}announcement/${annoId}`, mAnnouncement);
            const {data} = response;
            console.log(data);
            setMannouncement({
                agenda:'',
                description:'',
                date:'',
                time:'',
                duration:{
                    type:'',
                    value:0
                }
            })
            setEditAnno(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDeleteAnnouncement(annoId){

        console.log(annoId);
        try {
            await axios.delete(`${appUrl}announcement/${annoId}`);
            const foundAnno = announcements?.find(anno => anno?._id === annoId);

            if(foundAnno){
                console.log("found");
               setAnnouncements(prev =>
                announcements?.filter(anno => anno?._id !== annoId)
               );
            }
        } catch (error) {
            console.log(error);
        }
    }

    //set current message
    async function handleSetCurrentMessage(message){
        setCurrentMessage(message);

        //update viewed announcement

        try {
            const foundId = message?.viewList?.find((id)=> id === activeUser?._id);
            if(!foundId){
                let viewList = message.viewList?.concat(activeUser?._id)
                const response = await axios.put(`${appUrl}announcement/${message?._id}`, {...message, viewList});
                const {data} = response;
                console.log(data);
                dispatch(getAnnouncements());
            }
            
            
        } catch (error) {
            console.log(error);
        }


    }

   
    useEffect(()=>{

        if(announcementsStatus === 'idle'){
            setIsLoading(true)
            dispatch(getAnnouncements());
        }

        else if(announcementsStatus !== 'idle'){
            setAnnouncements(foundAnnouncements);
            setIsLoading(false);
            removeInvalidAnnouncements();
        }


    }, [dispatch, announcementsStatus, foundAnnouncements, activeUser]);

    // if(isLoading){
    //     return <Loader/>
    // }
  return (
    <div className='cms-announcement-body'>

        <SubNav page={'Messages'} pageIcon={'fa-bell'} />

        <div className='cms-announcements-section'>
        <div className="cms-messages-container">

        <div className="cms-anno-messages-container">
        {
            announcements?.length? [...announcements]?.sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt))?.map((anno)=>{
                let isViewed = anno?.viewList?.find((id)=> id === activeUser?._id);
        
                return(
                    <div onClick={()=>{handleSetCurrentMessage(anno)}} key={anno?._id} className="cms-main-announcement cms-main-announcement-mobile">

                        <div className="cms-announcement-details">
                            <h4 style={isViewed?{color:'gray'}:{}} className='cms-anno-title'>{anno?.agenda?.toUpperCase()}</h4>

                            <div className="cms-announcement-date">
                                <p className='cms-anno-date'>{anno?.date}</p>
                                <p className='cms-anno-time'>{anno?.time}</p>
                            </div>
                            
                        </div>

                        <div className="cms-announcement-description cms-announcement-description-container">
                            <p>{anno?.description?.substring(0, 45)+'...'}</p>
                        </div>

                       
                        
                    </div>
                )
            }):<></>
        }
        </div>

        <div className="cms-announcements-container">

        {/* <img src={chatback} className='cms-anno-chat-back' alt="chat" /> */}

            <div style={{border:"none"}} className="cms-main-announcement cms-main-announcement-view">

                <div className="cms-announcement-details">
                    <h4 className='cms-anno-title'>{currentMessage?.agenda?.toUpperCase()}</h4>

                    <div className="cms-announcement-date">
                        <p className='cms-anno-date'>{currentMessage?.date}</p>
                        <p className='cms-anno-time'>{currentMessage?.time}</p>
                    </div>
                    
                </div>

                {currentMessage?._id && <hr className='hr' />
}
                <div className="cms-announcement-description">
                    <p style={{maxWidth:"600px"}}>{currentMessage?.description}</p>
                </div>

               {activeUser?.isClassRep && currentMessage?._id && <div className="cms-anno-control-btns">
                    <button onClick={()=>{handleSetEditAnnouncement(currentMessage?._id)}} className='cms-btn anno-control-btn anno-delete-btn'>Edit</button>
                    <button onClick={()=>{handleDeleteAnnouncement(currentMessage?._id)}} className='cms-btn anno-control-btn anno-edit-btn'>Delete</button>
                </div>}

            </div>
        
        
        </div>

        </div>
       

            <br />
        {activeUser?.isClassRep && <div>


            <form className='cms-announcement-form'>
                        
                    
                        <div className="">
                            <input value={mAnnouncement.agenda}  onChange={handleChange} name='agenda' type="text" placeholder='Enter agenda' className='cms-input-field cms-assign-field' />

                        
                            <select onChange={handleChangeDuration} value={mAnnouncement.duration?.type} name="duration" id="duration" className='cms-input-field cms-anno-duration-select'>
                                <option value="">Duration</option>
                                <option value={'day'}>A Day</option>
                                <option value={'week'}>A Week</option>
                                <option value={'month'}>A Month</option>
                            </select>
                        </div>


                        <textarea placeholder='Enter description'  value={mAnnouncement.description}  onChange={handleChange}  name="description" id="description" cols="30" rows="10" className='cms-input-field cms-assign-field cms-announce-text-area'></textarea>
                        <br />
                        
                        {!isEditAnno? <button type='button' onClick={makeAnnouncement} className='cms-btn cms-btn-save cms-create-assign-btn'>Send</button>:
                        
                        <button type='button' onClick={()=>{handleEditAnnouncement(mAnnouncement?._id);}} style={{backgroundColor:"orange"}} className='cms-btn cms-btn-save cms-create-assign-btn'>Edit</button>}
                        <br />
                        <hr className='hr' />
                        
                        
                    
            </form>
        </div>
        }




        </div>

    </div>
   
  )
}

export default Announcement