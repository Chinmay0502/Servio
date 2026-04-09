import React from 'react'
import Hero from '../components/Hero'
import Service_Hero from '../components/Service_Hero'
import Marquee from '../components/Marquee'
import HowItWorks from '../components/HowItWorks'
import ServicesSection from '../components/ServicesSection'
import Providers_Section from '../components/Providers_Section'
import WhyServio from '../components/WhyServio'
import ReviewSection from '../components/ReviewSection'
import ContactCTA from '../components/ContactCTA'

const Home = () => {
  return (
    <div>
      <Hero/>
      {/* <Service_Hero/> */}
      <Providers_Section/>
      <Marquee/>
      <HowItWorks/>
      <ServicesSection/>
      <WhyServio/>
      <ReviewSection/>
      <ContactCTA/>
    </div>
  )
}

export default Home