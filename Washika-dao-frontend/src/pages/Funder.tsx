import Footer from "../components/Footer";
import GroupInfo from "../components/GroupInfo";
import NavBar from "../components/Navbar/Navbar";
import Strip from "../components/Strip";
/*
*@Auth policy -> Should be authenticated to access this page
*/
/**
 * Funder component is a React functional component that renders the main interface
 * for managing DAO operations. It includes a navigation bar, a main section with
 * introductory content and project search functionality, and additional components
 * for group information, a strip, and a footer.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 * 
 * @remarks
 * - The user must be authenticated to access this page.
 * - Utilizes components: NavBar, GroupInfo, Strip, and Footer.
 */
const Funder: React.FC = () => {
  return (
    <>
      <NavBar className={"navbarFunder"} />
      <main className="funder">
        <section className="first">
          <div className="one">
            <h1>Seamless fund and manage your DAO operations in one place</h1>
            <p>Welcome to a one-stop platform for your DAO operations</p>
          </div>

          <div className="two">
            <div>
              <img src="/images/searchnormal1.png" alt="search icon" width={27} height={27}/>
              <p>Search for Projects</p>
            </div>
            <img
              src="/images/Vector2.png"
              alt="arrow button"
              width={114}
              height={48}
              className="image"
            />
          </div>
        </section>

        <GroupInfo />
      </main>
      <Strip />
      <Footer className={"funderFooter"} />
    </>
  );
};

export default Funder;
