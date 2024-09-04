/* eslint-disable no-unused-vars */
import React from 'react';
import Hero from '../components/Home/Hero';
import RecentlyAdded from '../components/Home/RecentlyAdded';

const home = () => {
  return (
    <div className='bg-zinc-900 text-white px-10 py-8 '>
      <Hero/>
      <RecentlyAdded />
    </div>
    
  );
};

export default home