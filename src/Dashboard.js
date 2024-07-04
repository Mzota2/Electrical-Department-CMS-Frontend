import React from 'react'
import { Outlet, Navigate, Link } from 'react-router-dom'
import NavBar from './Components/NavBar/NavBar'
import { useDispatch, useSelector } from 'react-redux'

function Dashboard() {
 
  return (
    <div>
        <NavBar/>
        <Outlet/>
    </div>
  )
}

export default Dashboard