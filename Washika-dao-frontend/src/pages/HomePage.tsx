import React from "react";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HomePage/HeroSection";
import Buttons from "../components/HomePage/Buttons";
import About from "../components/HomePage/About";
import Info from "../components/HomePage/Info";

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
