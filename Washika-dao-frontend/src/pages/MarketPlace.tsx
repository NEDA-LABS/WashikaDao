import Footer from "../components/Footer";
import GroupInfo from "../components/GroupInfo";
import NavBar from "../components/Navbar/Navbar";
import Strip from "../components/Strip";
/*
 *@Auth policy -> Should be authenticated to access this page
 */
/**
 * Browse component is a React functional component that renders the main interface
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
const Browse: React.FC = () => {
  return (
    <>
      <NavBar className={"navbarMarketPlace"} />
      <main className="marketPlace">
        <section className="first">
          <div className="one">
            <h1>Seamless fund and manage your DAO operations in one place</h1>
            <p>Welcome to a one-stop platform for your DAO operations</p>
          </div>

          <div className="two">
            <div>
              <img
                src="/images/searchnormal1.png"
                alt="search icon"
                width={27}
                height={27}
              />
              <input
                type="search"
                name=""
                id=""
                placeholder="Search for Projects"
              />
            </div>
            <img
              className="arrow"
              src="/images/Vector2.png"
              alt="arrow button"
            />
          </div>
        </section>

        <GroupInfo />
      </main>
      <Strip />
      <Footer className={"marketPlaceFooter"} />
    </>
  );
};

export default Browse;
