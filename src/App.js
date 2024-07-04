
import React from "react";
import NavBar from "./Components/NavBar/NavBar";
import { Routes , Route} from "react-router-dom";
import Groups from "./Pages/Groups/Groups";
import Home from "./Pages/Home/Home";
import SignIn from "./Pages/SignIn/SignIn";
import Dashboard from "./Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { getStudents, setActive } from "./State/StudentsSlice";
import PersisistLogin from "./PersisistLogin";
import Modules from "./Pages/Modules/Modules";
import Classes from "./Pages/Classes/Classes";
import Students from "./Pages/Students/Students";
import Settings from "./Pages/Settings/Settings";
import Announcement from "./Pages/Announcement/Announcement";
import Exams from "./Pages/Exams/Exams";
import Assignments from "./Pages/Assignments/Assignments";
import SemesterInfo from "./Pages/SemesterInfo/SemesterInfo";

function App() {
  const dispatch = useDispatch();
  const foundUser = JSON.parse(localStorage.getItem('cms-user'));

  const foundStudents = useSelector(state => state.students.data);
  const studentStatus = useSelector(state => state.students.status);

  
  function removeCredentials(){
    setTimeout(()=>{
      localStorage.removeItem('cms-user');
    }, 1000*60*60*24);  // remove after a day
  }

  React.useEffect(()=>{
  
    if(studentStatus === 'idle'){
      dispatch(getStudents())
    }

    else if(studentStatus !== 'idle'){
      if(foundUser){
        const activeStudent = foundStudents?.find(std => std._id === foundUser?.studentId);
        if(activeStudent){
          dispatch(setActive(activeStudent)); //set active students
        
        }
      }
    }

    removeCredentials(); //runs after 24 hours

}, [dispatch, foundUser, studentStatus, foundStudents])

  return (
    <div className="App">
     <Routes>

      <Route path='/signin' element={<SignIn/>} />
      
      <Route path="/" element={<PersisistLogin/>}>
        <Route path="/" element={<Dashboard/>}>
          <Route path="/" element={<Home/>} />
          <Route path="/students" element={<Students/>} />
          <Route path="/modules" element={<Modules/>}/>
          <Route path="/classes" element={<Classes/>}/>
          <Route path='/groups' element={<Groups/>} />
          
        </Route>
        <Route path="/semester-info" element={<SemesterInfo/>}/>
        <Route path="/settings" element={<Settings/>} />
       
        <Route path='/announcements' element={<Announcement/>} />
      
        {/* <Route path="/exams" element={<Exams/>}/>
        <Route path="/assignments" element={<Assignments/>} /> */}
       
      </Route>
      
     </Routes>


    </div>
  );
}

export default App;
