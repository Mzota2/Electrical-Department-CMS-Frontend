import React, { useState } from 'react';
import './Today.css';
import  {useSelector, useDispatch} from 'react-redux';
import {getModules} from '../../State/ModulesSlice';
import {Close, Brightness1} from '@mui/icons-material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

function Today({todayModules, handleClose}) {
    //enlarge
    const [enlarge, setEnlarge] = useState(false);


    //dispact
    const dispatch = useDispatch();

    //find today modules
    const foundModules= useSelector(state => state.modules.data);
    const moduleStatus = useSelector(state => state.modules.status);
  

    function handleEnlarge(){
        setEnlarge(prev => !prev);
    }


    React.useState(()=>{

        return()=>{
            setEnlarge(false);
        }
      

    }, [dispatch, foundModules, moduleStatus, enlarge])


  return (
    <div className='cms-today-outer-container'>

        <div className='cms-today-inner-container'>

            <div style={{zIndex:1}} onClick={handleClose} className="close-icon-container cms-home-close">
                <Close className='close-icon' />
            </div>

            <div className={`${enlarge?"cms-enlarge-window":"cms-minimise-window"} cms-today-main-container`}>
                <h3 className='cms-today-classes-title'>Today's Classes</h3>
            {todayModules?.map((today)=>{
                return(
                    <div key={today?._id} className="cms-today-cls">
                        <p>{today?.code}</p>
                        <p>{today?.lecturer}</p>

                        <Brightness1 className='cms-class-on-icon cms-today-active-icon'/>

                    </div>
                )
            })}

            <div onClick={handleEnlarge} className="cms-notice-expand-icon cms-today-exapand-icon">

                {
                enlarge?<CloseFullscreenIcon className='cms-expand-icon' />:
                <OpenInFullIcon className='cms-expand-icon' />
                }
                
            </div>

            </div>

        </div>
          
            

    </div>
  )
}

export default Today