import React from 'react';
import Nav from '../../components/LandingNav';
import Hero from './Hero';
import Bento from './Bento';
import CallToAction from './CallToAction';
function LandingPage() {
  return (
    <div className='w-screen bg-black'>
        <div className='sticky top-0 z-50'><Nav></Nav></div>
        <div>
        <Hero/>
        <Bento/>
        <CallToAction/>
        </div>
    </div>
  );
}

export default LandingPage;