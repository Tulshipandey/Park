import Hero from './components/ui/Hero';
import Features from './components/ui/Features';
import Testimonials from './components/ui/Testimonials';
import CTA from './components/ui/CTA';
import QuickSearch from './components/ui/QuickSearch';
import HowItWorks from './components/ui/HowItWorks';

export default function Home() {
  return (
    <div>
      <Hero />
      <QuickSearch />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTA />
    </div>
  );
}
