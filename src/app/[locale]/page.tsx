import Hero from '@/components/sections/Hero';
import WhatIsProvox from '@/components/sections/WhatIsProvox';
import WhatWeOffer from '@/components/sections/WhatWeOffer';
import WhatYoullLearn from '@/components/sections/WhatYoullLearn';
import Contact from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhatIsProvox />
      <WhatWeOffer />
      <WhatYoullLearn />
      <Contact />
    </main>
  );
}
