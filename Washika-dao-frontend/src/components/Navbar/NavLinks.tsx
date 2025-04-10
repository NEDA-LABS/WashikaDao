// Import dependencies for routing, authentication, state management, and rendering.
import { Link } from "react-router-dom";
import AuthButton from "./AuthButton";
// import { useDaoNavigation } from "./useDaoNavigation";
// import { useMemberDaos } from "./useMemberDaos";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ReactDOM from "react-dom";

/**
 * Defines the expected props for the NavLinks component.
 *
 * @property {string} className - A string that represents the current view or page; used to conditionally render links.
 * @property {boolean} isOpen - Boolean flag to indicate if the mobile menu is currently open.
 * @property {(e: React.MouseEvent<HTMLAnchorElement>) => void} handleRegisterDaoLink - Callback for handling clicks on the "Open Dao" link.
 * @property {() => void} toggleMenu - Callback for toggling the mobile menu visibility.
 */
interface NavLinksProps {
  className: string;
  isOpen: boolean;
  handleRegisterDaoLink: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  toggleMenu: () => void;
}

/**
 * NavLinks component renders the navigation menu with dynamic links based on user roles and the current page.
 *
 * It conditionally displays links such as "Open Dao", "EducationHUB", "MarketPlace", "Create Proposal", "Funder", and "DAO Tool Kit"
 * based on the provided className and the user’s DAO membership.
 *
 * @param {NavLinksProps} props - Component properties.
 * @returns {JSX.Element} The rendered navigation menu.
 */

const NavLinks: React.FC<NavLinksProps> = ({
  className,
  isOpen,
  handleRegisterDaoLink,
  toggleMenu,
}) => {
  // Retrieve the user's address from the Redux store.
  const address = useSelector((state: RootState) => state.auth.address);

  // Fetch the DAOs associated with the current address; if none exists, an empty string is passed.
  // const { daos } = useMemberDaos(address || "");

  // Determine if the "DAO Tool Kit" link should be visible (only when DAOs exist).
  // const showDaoToolKit = daos && daos.length > 0;

  // Use the custom hook to filter DAOs and to obtain a navigation function for the selected DAO.
  // const { filteredDaos, navigateToDao } = useDaoNavigation(daos);

  /**
   * Handles the click event for the "DAO Tool Kit" link.
   * - Prevents the default link action.
   * - If a DAO transaction hash is stored in localStorage, it tries to find the corresponding DAO from the filtered list.
   * - If a matching DAO is found, it navigates directly to that DAO.
   * - If there is exactly one filtered DAO, navigates to it.
   * - Otherwise, triggers the display of a pop-up notification.
   *
   * @param {React.MouseEvent<HTMLAnchorElement>} e - The click event.
   */
  // const handleDaoToolKitClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  //   e.preventDefault();
  //   const selectedDaoTxHash = localStorage.getItem("selectedDaoTxHash");

  //   if (selectedDaoTxHash) {
  //     const selectedDao = filteredDaos.find(
  //       (dao) => dao.daoTxHash === selectedDaoTxHash
  //     );
  //     if (selectedDao) {
  //       navigateToDao(selectedDao);
  //       return;
  //     }
  //   }

  //   if (filteredDaos.length === 1) {
  //     navigateToDao(filteredDaos[0]);
  //   }
  // };

  // Determines if the "Open Dao" link should be shown based on the current page context.
  const shouldShowRegisterDao = ![
    "CreateProposal",
    "DaoRegister",
    "SuperAdmin",
  ].includes(className);

  // Define the content to render in the mobile menu portal when the menu is open.
  const mobileMenuContent = (
    <ul className="nav-links open">
      {shouldShowRegisterDao && (
        <li>
          <Link to="/DaoRegistration" onClick={handleRegisterDaoLink}>
            Open Dao
          </Link>
        </li>
      )}
      <li>
        <Link to="/Blogs">EducationHUB</Link>
      </li>
      {className === "DaoProfile" || className === "navbarProposal" ? (
        <li className="three">
          <Link to="/MarketPlace">MarketPlace</Link>
        </li>
      ) : className === "SuperAdmin" ? (
        <>
          <li className="three">
            <Link to={"/CreateProposal"}>Create Proposal</Link>
          </li>
          <li className="three">
            <Link to={`/Funder/${address}`}>Funder</Link>
          </li>
        </>
      ) : (
        // showDaoToolKit && (
        //   <li className="three">
        //     <Link to="" onClick={handleDaoToolKitClick}>
        //       DAO Tool Kit
        //     </Link>
        //   </li>
        // )
        address && (
          <li className="three">
          <Link to={`/SuperAdmin/${address}`}>DAO Tool Kit</Link>
        </li>
        )
        
      )}
      {/* Render the authentication button with a prop to toggle the mobile menu */}
      <AuthButton className={className} toggleMenu={toggleMenu} />
    </ul>
  );

  return (
    <>
      {/* Main navigation menu container; its visibility is toggled via the isOpen prop */}
      <ul className={`nav-links ${isOpen ? "hidden" : ""}`}>
        {/* Render the "Open Dao" link if allowed by the current page context */}
        {shouldShowRegisterDao && (
          <li>
            <Link to="/DaoRegistration" onClick={handleRegisterDaoLink}>
              Open Dao
            </Link>
          </li>
        )}

        {/* Static link to the Education Hub */}
        <li>
          <Link to="/Blogs">EducationHUB</Link>
        </li>

        {/* Conditionally render additional links based on the page's context */}
        {className === "DaoProfile" || className === "navbarProposal" ? (
          // When on a DAO profile or proposal page, show the MarketPlace link.
          <li className="three">
            <Link to={"/MarketPlace"}>MarketPlace</Link>
          </li>
        ) : className === "SuperAdmin" ? (
          // For SuperAdmin users, render links for creating proposals and accessing the Funder section.
          <>
            <li className="three">
              <Link to={"/CreateProposal"}>Create Proposal</Link>
            </li>
            <li className="three">
              <Link to={`/Funder/${address}`}>Funder</Link>
            </li>
          </>
        ) : (
          // For regular users with DAO memberships, render the DAO Tool Kit link.
          // showDaoToolKit && (
          //   <li className="three">
          //     <Link to="" onClick={handleDaoToolKitClick}>
          //       DAO Tool Kit
          //     </Link>
          //   </li>
          // )
          address && (
            <li className="three">
            <Link to={`/SuperAdmin/${address}`}>DAO Tool Kit</Link>
          </li>
          )
        )}

        {/* Render the authentication button (handles login/logout actions) */}
        <AuthButton className={className} />
      </ul>

      {/* When the mobile menu is open, render the mobile menu content into a portal.
          This allows the mobile menu to appear above other content in the DOM. */}
      {isOpen &&
        ReactDOM.createPortal(
          mobileMenuContent,
          document.getElementById("mobile-menu-portal") as HTMLElement
        )}
    </>
  );
};

// Export NavLinks for use in other parts of the application.
export default NavLinks;
