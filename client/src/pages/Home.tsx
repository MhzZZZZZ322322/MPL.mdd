import { useEffect } from 'react';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Events from '@/components/sections/Events';
import Rankings from '@/components/sections/Rankings';
import Partners from '@/components/sections/Partners';
import FAQ from '@/components/sections/FAQ';
import SimpleContactForm from '@/components/sections/SimpleContactForm';
import { Helmet } from 'react-helmet';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  useEffect(() => {
    // Add Google fonts to the document head
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&family=Rajdhani:wght@400;500;600;700&display=swap';
    document.head.appendChild(linkElement);

    // Add Font Awesome to the document head
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css';
    document.head.appendChild(fontAwesome);

    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 50,
      delay: 100,
    });

    return () => {
      document.head.removeChild(linkElement);
      document.head.removeChild(fontAwesome);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>MPL - Moldova Pro League | Esports din pasiune</title>
        <meta name="description" content="Moldova Pro League - Comunitatea de esports din Moldova, creată din pasiune pentru gaming competitiv. Alătură-te turneelor noastre!" />
      </Helmet>
      <Hero />
      <About />
      <Events />
      <Rankings />
      <Partners />
      <FAQ />
      <SimpleContactForm />
    </>
  );
};

export default Home;
