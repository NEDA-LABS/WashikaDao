import { useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar/Navbar";
import { LoadingPopup } from "../components/SuperAdmin/LoadingPopup";
import RequestInvite from "../components/MemberProfile/RequestInvite";
import MemberButtons from "../components/MemberProfile/MemberButtons";
import MemberTop from "../components/MemberProfile/MemberTop";
import MemberBody from "../components/MemberProfile/MemberBody";
import MemberTransactions from "../components/MemberProfile/MemberTransactions";
import RepaymentModal from "../components/MemberProfile/RepaymentModal";

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
