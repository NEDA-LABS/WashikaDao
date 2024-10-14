import  Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/headerFooter.css";


/** Thirdweb wallet connection imports **/
import { createThirdwebClient } from "thirdweb";
import {  ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { lightTheme } from "thirdweb/react";

import { celoAlfajoresTestnet} from "thirdweb/chains";

interface NavBarProps {
  className: string;
  // user?: { name: string };
}

const NavBar: React.FC<NavBarProps> = ({ className/*, user*/ }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/JoinPlatform");
  };

  /*
   * Setting up thirdweb client
   */

const _clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!;
const client = createThirdwebClient({ clientId: _clientId });
const customTheme = lightTheme({
  colors: {
    modalBg: "yellow",
  },
});
 const chain = celoAlfajoresTestnet;//TODO: Switch to mainnet when in prod

/**
 * on click should pop up thirdweb modal
 */
function handleWalletConnection () {
    console.log("yes i got called");
 return (
      <ThirdwebProvider>
      <ConnectButton client={client} theme={customTheme} accountAbstraction={{ chain, sponsorGas: false }} />
      </ThirdwebProvider>
    )
  }
  /**
function handleTestingComponents() {
   return (
    <h1> I test whether a component is the problem</h1>
    )
  }

**/
  const renderProfileLink = () => {
    if (className === "DaoProfile" || className === "navbarProposal") {
      return (
        <li className="three">
          <Link href="/funder">FUNDERS</Link>
        </li>
      );
    } else {
      return (
        <li className="three">
          <Link href="/DaoProfile">DAO Tool Kit</Link>
        </li>
      );
    }
  };

  const renderButton = () => {
    if (className === "DaoProfile" || className === "navbarProposal") {
      return (
        <button onClick={handleClick}>Add Member</button>
      );
    } else if (className === "navbarOwner" /*&& user*/) {
      return (<>
        {/* <button>{user.name}</button> */}
        <button>user.name</button></>
      );
    }
    return (
      <button onClick={handleWalletConnection}>Karibu</button>
    );
  };

  return (
    <nav className={className}>
      <div>
        <img src="/images/LOGO SYMBLO(1).png" alt="logo" width="24" />
        <Link href="/">
          <img src="/images/words logo.png" className="wordLogo" alt="logo" />
        </Link>
      </div>
      <ul>
        <li>
          <Link href="/DaoRegistration">Fungua DAO</Link>
        </li>
        <li>
          <Link href="/JifunzeElimu">Jifunze/Elimu</Link>
        </li>
        {renderProfileLink()}
        <li className="show">
          {renderButton()}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
