import React from "react";
import NavBar from "../components/Navbar/Navbar.js";
import Footer from "../components/Footer.js";
import HeroSection from "../components/HomePage/HeroSection.js";
import Buttons from "../components/HomePage/Buttons.js";
import About from "../components/HomePage/About.js";
import Info from "../components/HomePage/Info.js";

const HomePage: React.FC = () => {
  return (
    <>
      <NavBar className={""} />
      <main>
        <HeroSection />
        <Buttons />
        <About />
        <Info />
      </main>
      <Footer className={""} />
    </>
  );
};

export default HomePage;
