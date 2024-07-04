import React from 'react'
import './DialogBox.css';

function DialogBox({message, handleConfirm, handleDeny, type, id}) {
  
  return (
    <div className='cms-dialog-box-container'>
      <div className="cms-dialog-box">

        <div className="cms-dialog-details">

          <p style={{color:`${type === 'danger'? 'red':'green'}`}} className='cms-dialog-type'>{type}</p>
          <p className='cms-dialog-message'>{message}</p>

        </div>

        <div className="cms-dialog-control-btns">

          <button onClick={()=>{
            handleConfirm()
            handleDeny();
          }} className="cms-btn cms-dialog-confirm">Yes</button>
          <button onClick={handleDeny} className="cms-btn cms-dialog-cancel">Cancel</button>

        </div>
       

      </div>

    </div>
  )
}

export default DialogBox