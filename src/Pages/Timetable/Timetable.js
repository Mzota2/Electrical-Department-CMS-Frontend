import React, { useEffect, useState, useRef } from 'react'
import './Timetable.css';
import { useDispatch, useSelector } from 'react-redux';
import { getModules } from '../../State/ModulesSlice';
import { getPrograms } from '../../State/ProgramsSlice';
import { animated, useSpring } from '@react-spring/web';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { message } from 'antd';


function Timetable() {
  const [isLoading, setIsLoading] = useState(false);

  //timetable
  const pdfRef = useRef();

  const dispatch = useDispatch();

  const [filterTimetable, setFilterTimetable] = useState('');

  //active user
  const activeUser = useSelector(state => state.students.activeUser);
  const studentsStatus = useSelector(state => state.students.status);
  const foundPrograms = useSelector(state => state.programs.data);
  const foundProgramsStatus = useSelector(state => state.programs.status);

  //modules
  const foundModules = useSelector(state => state.modules.data);
  const foundModulesStatus = useSelector(state => state.modules.status);
  
  const userModules = foundModules?.filter((md)=>{
    return activeUser?.modules?.find(id => id === md?._id);
  });
  const [timetable, setTimetable] = useState([...userModules]);

  const [modules, setModules] = useState({
    monModules:[],
    tueModules:[],
    wedModules:[],
    thurModules:[],
    friModules:[]
  });

  //animations
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: {opacity:1 },

    config:{
        duration:2000,
        delay:2000
    }
  });

  const slideDown = useSpring({
    from:{y:-100},
    to:{y:0}
  })

  function handleChangeFilterTimeTable(e){
    setFilterTimetable(e.target.value);

    if(foundModules?.length){

      const userModules = foundModules?.filter((md)=>{
        return activeUser?.modules?.find(id => id === md?._id);
      });

      const programModules = foundModules?.filter((md)=>{
        return md?.programsId?.find(id => id === activeUser?.program);
      });

      switch (e.target.value) {
        case 'my modules':
          setTimetable(userModules);
          break;
        case 'program modules':
          setTimetable(programModules);
          break;
        case 'department modules':
          setTimetable(foundModules);
          break;
        default:
          break;
      }
    }

    
  }

  function downloadPDF(){

    let input = pdfRef.current;
    try {
      
      html2canvas(input).then((canvas)=>{
        const imgData  = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);

        const pdfWidth = pdf.internal.pageSize.getWidth(); 
        const pdfHeight = pdf.internal.pageSize.getHeight();
      
        const imgWidth = canvas.width + canvas.scrollWidth;
        const imgHeight = canvas.height + canvas.scrollHeight;
        const ratio = Math.min(pdfWidth/imgWidth, pdfHeight/imgHeight);
        const imgX = (pdfWidth -imgWidth * ratio);
        const imgY = 30;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth*ratio, imgHeight*ratio);
        const foundProgram = foundPrograms?.find((pg)=> pg?._id === activeUser?.program);
        pdf.save(`${foundProgram?.code ? foundProgram?.code + " Timetable":"Timetable"}`);
      });

      message.success("Completed Downloading Timetable")
      
    } catch (error) {
      console?.log(error);
    }finally{
      
    }
    
  }



  useEffect(()=>{

    if(foundModulesStatus === 'idle'){
      dispatch(getModules());
    }

    else if(foundModulesStatus !== 'idle' && foundModules?.length){
     
      const monModules = timetable?.map((md)=>{
        return md?.classDays?.map((cls)=>{
          if( cls?.day === 'Monday'){
            return{
              module:md?.name,
              code:md?.code,
              lecturer:md?.lecturer,
              from:cls?.from,
              to:cls?.to,
              room:cls?.room
            }
          }
          
        })?.filter((cls)=> cls);
      }).filter((cls)=> cls?.length)?.flat()?.sort((a , b)=> Number(a?.from?.slice(0, 2) - Number(b?.from?.slice(0, 2))));

      const tueModules = timetable?.map((md)=>{
        return md?.classDays?.map((cls)=>{
          if( cls?.day === 'Tuesday'){
            return{
              module:md?.name,
              code:md?.code,
              lecturer:md?.lecturer,
              from:cls?.from,
              to:cls?.to,
              room:cls?.room
            }
          }
          
        })?.filter((cls)=> cls);
      }).filter((cls)=> cls?.length)?.flat()?.sort((a , b)=> Number(a?.from?.slice(0, 2) - Number(b?.from?.slice(0, 2))));

      const wedModules = timetable?.map((md)=>{
        return md?.classDays?.map((cls)=>{
          if( cls?.day === 'Wednesday'){
            return{
              module:md?.name,
              code:md?.code,
              lecturer:md?.lecturer,
              from:cls?.from,
              to:cls?.to,
              room:cls?.room
            }
          }
          
        })?.filter((cls)=> cls);
      }).filter((cls)=> cls?.length)?.flat()?.sort((a , b)=> Number(a?.from?.slice(0, 2) - Number(b?.from?.slice(0, 2))));

      const thurModules = timetable?.map((md)=>{
        return md?.classDays?.map((cls)=>{
          if( cls?.day === 'Thursday'){
            return{
              module:md?.name,
              code:md?.code,
              lecturer:md?.lecturer,
              from:cls?.from,
              to:cls?.to,
              room:cls?.room
            }
          }
          
        })?.filter((cls)=> cls);
      }).filter((cls)=> cls?.length)?.flat()?.sort((a , b)=> Number(a?.from?.slice(0, 2) - Number(b?.from?.slice(0, 2))));

      const friModules = timetable?.map((md)=>{
        return md?.classDays?.map((cls)=>{
          if( cls?.day === 'Friday'){
            return{
              module:md?.name,
              code:md?.code,
              lecturer:md?.lecturer,
              from:cls?.from,
              to:cls?.to,
              room:cls?.room
            }
          }
          
        })?.filter((cls)=> cls);
      }).filter((cls)=> cls?.length)?.flat()?.sort((a , b)=> Number(a?.from?.slice(0, 2) - Number(b?.from?.slice(0, 2))));
      
      
      setModules(prev =>{
        return{
          ...prev,
          monModules,
          tueModules,
          wedModules,
          thurModules,
          friModules
        }
      })
    }

    if(foundProgramsStatus === 'idle'){
      dispatch(getPrograms());
    }
   

  }, [dispatch, foundModulesStatus, foundModules, activeUser, timetable])
  return (
    <div className='cms-timetable-container'>

      <div className="cms-timetable-filter-container">
        <select className='cms-field cms-add-student-field' onChange={handleChangeFilterTimeTable} name="timetable" id="timetable">
          <option value="my modules">My Modules</option>
          <option value="program modules">Program Modules</option>
          <option value="department modules">Deparment Modules</option>
        </select>

        <button onClick={downloadPDF} style={{backgroundColor:"var(--dark-blue)", color:"white", marginLeft:"1em"}} className='cms-btn'>Download PDF</button>
      </div>
      
      <animated.div ref={pdfRef}   style={slideDown} className="cms-timetable-days">
        {
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day)=>{
            return(
              <div key={day} className="cms-timetable-day">
                <p className='cms-timetable-class-day-title'>{day}</p>
              </div>
            )
          })
        }


        <div className="cms-timetable-mon">
          {
            modules?.monModules?.map((md, ind)=>{
                return (
                  <animated.div style={fadeIn} key={ind} className="cms-timetable-mon-cls">
                    <p className='cms-timetable-code'>{md?.code}</p>
                    <p>{md?.from} - {md?.to}</p>
                    <p>{md?.room}</p>
                    <p>{md?.lecturer}</p>

                  </animated.div>
                )
            })
          }
        </div>

        <div className="cms-timetable-tue">
        {
            modules?.tueModules?.map((md, ind)=>{
                return (
                  <animated.div style={fadeIn} key={ind} className="cms-timetable-mon-cls">
                    <p className='cms-timetable-code'>{md?.code}</p>
                    <p>{md?.from} - {md?.to}</p>
                    <p>{md?.room}</p>
                    <p>{md?.lecturer}</p>
                  </animated.div>
                )
            })
          }
        </div>

        <div className="cms-timetable-wed">
        {
            modules?.wedModules?.map((md, ind)=>{
                return (
                  <animated.div style={fadeIn} key={ind} className="cms-timetable-mon-cls">
                    <p className='cms-timetable-code'>{md?.code}</p>
                    <p>{md?.from} - {md?.to}</p>
                    <p>{md?.room}</p>
                    <p>{md?.lecturer}</p>
                  </animated.div>
                )
            })
          }
        </div>

        <div className="cms-timetable-thur">
        {
            modules?.thurModules?.map((md,ind)=>{
                return (
                  <animated.div style={fadeIn} key={ind} className="cms-timetable-mon-cls">
                    <p className='cms-timetable-code'>{md?.code}</p>
                    <p>{md?.from} - {md?.to}</p>
                    <p>{md?.room}</p>
                    <p>{md?.lecturer}</p>
                  </animated.div>
                )
            })
          }
        </div>

        <div className="cms-timetable-fri">
        {
            modules?.friModules?.map((md, ind)=>{
                return (
                  <animated.div style={fadeIn} key={ind} className="cms-timetable-mon-cls">
                    <p className='cms-timetable-code'>{md?.code}</p>
                    <p>{md?.from} - {md?.to}</p>
                    <p>{md?.room}</p>
                    <p>{md?.lecturer}</p>
                  </animated.div>
                )
            })
          }
        </div>

      </animated.div>

      
      
    </div>
  )
}

export default Timetable