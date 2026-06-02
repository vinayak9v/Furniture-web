import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'
import PageHeader from './PageHeader'
import UserProfile from './UserProfile'

function page() {
  return (
    <div>
      <Navbar/>
      <PageHeader/>
      <UserProfile/>
      <Footer/>
    </div>
  )
}

export default page
