import React from 'react'
import Home from './pages/Home'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUserData } from './store/authSlice.js'
function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
   dispatch(fetchUserData())
  },[dispatch])
  return (
     <Home/>
  )
}

export default App
