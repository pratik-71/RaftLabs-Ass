import React from 'react';
import Layout from '../Components/Layout';
import Hero from '../Components/Hero';
import MenuSection from '../Components/MenuSection';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <MenuSection />
    </Layout>
  );
}
