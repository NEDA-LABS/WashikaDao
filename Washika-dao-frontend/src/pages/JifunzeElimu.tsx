// Import necessary dependencies from React and third-party libraries for building the blog page.
import React from "react";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar/Navbar";
import BlogList from "../components/BlogList"; 

/**
 * JifunzeElimu is a React functional component that renders an educational blog page.
 *
 * This component:
 * - Renders a header section, navigation bar, search/filter controls, and pagination.
 * - Does not require user authentication for access.
 *
 */
const JifunzeElimu: React.FC = () => { 
  return (
    <>
      <NavBar className={""} />
      <Helmet>
        <title>Jifunze Elimu</title>
        <meta
          name="description"
          content="Explore educational content and blogs on various blockchain topics"
        />
      </Helmet>

      <main className="jifunze">
        <div className="onee">
          <div className="left">
            <h2>This is us, WashikaDAO!</h2>
            <p>
              We enable community saving groups to reach their goals and actualize wealth with transparency and ease!
            </p>
          </div>
          <div className="image">
            <img src="images/LOGO SYMBLO.png" alt="logo"  />
          </div>
        </div>
        <BlogList />
      </main>

      <Footer className={""} />
    </>
  );
};

export default JifunzeElimu;
