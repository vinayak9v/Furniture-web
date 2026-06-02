import Navbar from '@/components/Navbar'
import React from 'react'
import CartPage from './CartPage'
import Footer from '@/components/Footer'

function page() {
  return (
    <div>
      <Navbar/>
      <CartPage/>
      <Footer/>
    </div>
  )
}

export default page
