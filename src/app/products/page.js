import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'
import PageHeader from './PageHeader'
import ProductListingPage from './ProductListingPage'
import ServiceFeatures from './ServiceFeatures'

function page() {
  return (
    <div>
      <Navbar/>
      <PageHeader/>
      <ProductListingPage/>
      <ServiceFeatures/>
      <Footer/>
    </div>
  )
}

export default page
