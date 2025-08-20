import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories/Categories';
import WeeklyBestsellers from '../components/Products/WeeklyBestsellers';
import MostLoved from '../components/Products/MostLoved';


import OurPartners from '../components/OurPartners';

export default function Home() {
  return (
    <div >
           {/* Animated bubbles for water theme */}
      

      <Hero className="pt-10" />
      
      <Categories />
      <WeeklyBestsellers />
    
       <OurPartners/>
     
     
    </div>
  );
} 