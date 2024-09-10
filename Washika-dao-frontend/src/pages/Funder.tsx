import Footer from "../components/Footer";
import GroupInfo from "../components/GroupInfo";
import NavBar from "../components/NavBar";
import Strip from "../components/Strip";

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
