import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-[url("/bg_img.png")]'>
      <Navbar/>
      <Header/>
    </div>
  )
}

export default Home
