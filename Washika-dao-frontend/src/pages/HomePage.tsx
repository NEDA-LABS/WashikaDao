import React from "react";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import GroupInfo from "../components/GroupInfo";
import BlogList from "../components/BlogList"; 

/**
 * @Auth Policy: Not necessarily authenticated for access but different components require access
 */

/**
 * Represents the home page component of the application.
 *
 * This component displays various sections including a navigation bar,
 * informational content about digital financial groups, and a blog section. 
 * It allows users to navigate
 * to DAO registration and educational pages.
 *
 * @component
 * @returns {JSX.Element} The rendered home page component.
 *
 * @remarks
 * - Includes navigation to DAO registration and educational pages.
 *
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Navigate to the DAO registration page when the corresponding button is clicked.
  const handleDaoRegistration = () => {
    navigate("/DaoRegistration");
  };

  // Navigate to the educational page when the corresponding button is clicked.
  const handleJifunzeElimu = () => {
    navigate("/Blogs");
  };

  return (
    <>
      <NavBar className={""} />
      <main>
        <section className="image-container">
          <div className="inner-container">
            <img src="images/LOGO FULL.png" alt="logo" />
            <p className="main">
              Govern and Manage <br />
              your community <br />
              Saving Group
            </p>
            <p>
              Welcome to WashikaDAO, a one stop solution <br />
              for all your community group needs
            </p>
          </div>
        </section>

        <div className="buttons">
          <button className="button-1" onClick={handleDaoRegistration}>
            Create a DAO
          </button>
          <button className="button-2" onClick={handleJifunzeElimu}>
            What is a DAO?
          </button>
        </div>

        <p className="parag-container">
          We enable Saving Groups to manage and transparency
          <br /> grow their savings with Ease and
          <br />
          transparency
        </p>

        <section className="main-container">
          <div className="boxes">
            <div className="box one">
              <div className="box-left">
                <div>
                  <h1>Safe and Modern</h1>
                  <p>
                    Securely manage your DAO's activities. With real time
                    <span> Account balance, Share balance</span> and easy apply
                    for <span>loans</span>.
                  </p>
                </div>
              </div>
              <div className="box-right">
                <div>
                  <img src="images/LOGO SYMBLO.png" alt="logo" width="63" />
                  <a href="Homepage.html">
                    <img src="images/wordlogo.png" alt="logo" width="253" />
                  </a>
                </div>
              </div>
            </div>

            <div className="box two">
              <div className="box-left two">
                <div>
                  <h1>Education HUB</h1>
                  <p>
                    With a dedicated portal for education,
                    <span> Learn about the digital economy</span>. Learn how you
                    can grow your income with technology
                  </p>
                </div>
              </div>
              <div className="box-right"></div>
            </div>

            <div className="half-box box-left">
              <div>
                <h1>Apply for Loans with Ease</h1>
                <p>
                  Grow your income with ease.
                  <span>
                    {" "}
                    Get access to loans with trust collateral and low interest
                  </span>
                  . Building a trust economy that is community first
                </p>
              </div>
            </div>
          </div>

          <GroupInfo />
        </section>
        <div className="parag-container-two">
          <h2>This is us, WashikaDAO!</h2>
          <p className="sub-parag-container">
            We enable community saving groups to reach <br />
            their goals and actualize wealth with transparency <br />
            and ease!
          </p>
        </div>
        <BlogList />
      </main>
      <Footer className={""} />
    </>
  );
};

export default HomePage;
