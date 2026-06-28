import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustedPayments from "../components/TrustedPayments";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import AppShowcase from "../components/AppShowcase";
import AppleShowcase from "../components/AppleShowcase";
import WhyContriba from "../components/WhyContriba";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import useReveal from "../hooks/useReveal";

function Home() {
  useReveal();

  return (
    <>
      <Navbar />
      <Hero />
      <TrustedPayments />
      <Features />
      <HowItWorks />
      <AppShowcase />
      <AppleShowcase />
      <WhyContriba />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}

export default Home;