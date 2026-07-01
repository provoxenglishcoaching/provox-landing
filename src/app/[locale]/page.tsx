import Hero from '@/components/sections/Hero';
import StatBar from '@/components/sections/StatBar';
import Programs from '@/components/sections/Programs';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <Hero />
      <StatBar />
      <Programs />
      <About />
      <Contact />
    </main>
  );
}
