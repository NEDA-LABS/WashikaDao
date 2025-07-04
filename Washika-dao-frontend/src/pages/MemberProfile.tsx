import { useState } from "react";
import { useParams } from "react-router";
import Footer from "../components/Footer.js";
import NavBar from "../components/Navbar/Navbar.js";
import { LoadingPopup } from "../components/SuperAdmin/LoadingPopup.js";
import RequestInvite from "../components/MemberProfile/RequestInvite.js";
import MemberButtons from "../components/MemberProfile/MemberButtons.js";
import MemberTop from "../components/MemberProfile/MemberTop.js";
import MemberBody from "../components/MemberProfile/MemberBody.js";
import MemberTransactions from "../components/MemberProfile/MemberTransactions.js";
import RepaymentModal from "../components/MemberProfile/RepaymentModal.js";

const MemberProfile: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showStatement, setShowStatement] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const params = useParams<{ address: string }>();
  const memberAddr = params.address ?? "";
  const handleAddMemberClick = () => {
    setShowForm(!showForm);
  };

  if (!memberAddr) {
    return <LoadingPopup message="Loading wallet…" />;
  }

  return (
    <>
      <NavBar className={"navbarDaoMember"} />
      <main className="member">
        <MemberTop />
        <MemberButtons
          handleAddMemberClick={handleAddMemberClick}
          setShowStatement={setShowStatement}
          setShowPaymentModal={setShowPaymentModal}
        />
        <MemberBody memberAddr={memberAddr} />
        <RequestInvite
          showForm={showForm}
          handleAddMemberClick={handleAddMemberClick}
        />
        <MemberTransactions
          memberAddr={memberAddr}
          setShowStatement={setShowStatement}
          showStatement={showStatement}
        />
        <RepaymentModal
          memberAddr={memberAddr}
          showPaymentModal={showPaymentModal}
          setShowPaymentModal={setShowPaymentModal}
        />
      </main>
      <Footer className={"footerDaoMember"} />
    </>
  );
};

export default MemberProfile;
