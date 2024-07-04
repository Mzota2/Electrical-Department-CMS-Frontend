import React from "react";
import { animated, useSpring } from "@react-spring/web";

function Groups({modules, foundStudents}){

     //animations
     const slideLeft = useSpring({
        from: { transform: 'translateX(-100%)' },
        to: {transform:'translateX(0%)' },
      });

    return(
        <div className="cms-my-groups-container">
                     
                {modules?.map((md, index)=>{
                    return(
                        <animated.div style={slideLeft} key={index} className=''>
                                <div  key={index} className="cms-user-group group ">
                                    <h3 className='cms-task-title'>{md?.task}</h3>
                                    <h3 className='cms-task-module'>{md?.module}</h3>
                                    <br />
                                {
                                    md?.group?.map((memberId, index)=>{
                                    const member = foundStudents?.find(std => std?._id === memberId);
                                    return(
                                        <div  key={index} className="cms-random-group-student">
                                            <p  className='member-title'>{member?.username}</p>
                                            <p  className='member-regNo'>{member?.regNO}</p> 
                                        </div>
                                        
                                    )
                                    })
                                }
                                    <br />
                                    <h3 className='cms-task-module'>Group {md?.groupNumber}</h3>
                                
                                </div>
                        
                        </animated.div>
                        )  
                  
                }) 
                
                }
            </div>
    )
}

export default Groups;