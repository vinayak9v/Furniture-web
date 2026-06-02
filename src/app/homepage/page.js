import Navbar from '@/components/Navbar'
import React from 'react'
import HeroSection from './Hero'
import FeaturesBanner from './Features'
import CategoriesSection from './Categories'
import PromoBanners from './PromoBanners'
import BestSellers from './BestSellers'
import WhyChooseUs from './WhyChooseUs'
import Testimonials from './Testimonials'
import Footer from '@/components/Footer'
import InspirationSection from './InspirationSection'

function Heropagee() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <FeaturesBanner/>
      <CategoriesSection/>
      <PromoBanners/>
      <BestSellers/>
      <InspirationSection/>
      <WhyChooseUs/>
      <Testimonials/>
      <Footer/>
    </div>
  )
}

export default Heropagee
