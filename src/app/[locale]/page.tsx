import Hero from '@/components/sections/Hero';
import Courses from '@/components/sections/Courses';
import Preview from '@/components/sections/Preview';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <Hero />
      <Courses />
      <Preview />
      <About />
      <Contact />
    </main>
  );
}
