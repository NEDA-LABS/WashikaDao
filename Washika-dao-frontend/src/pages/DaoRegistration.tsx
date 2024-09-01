import Footer from "../components/Footer";
import DaoForm from "../components/DaoForm";
import NavBar from "../components/NavBar";
import MemberForm from "../components/MemberForm";
import { useNavigate } from "react-router-dom";

const DaoRegistration: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/DaoProfile");
  };
  return (
    <>
      <NavBar className={""} />
      <main className="daoRegistration">
        <div className="funguaKikundi">
          <h1>Fungua Kikundi chako kirahisi, upate faida kibao</h1>
          <p>
            Tumia teknolojia yetu kuunda, kuendesha, na kuboresha kikundi chako
          </p>
        </div>

        <div className="circle-container">
          <div className="circle one">1</div>
          <div className="line"></div>
          <div className="circle">2</div>
          <div className="line"></div>
          <div className="circle">3</div>
          <div className="line"></div>
          <div className="circle">4</div>
          <div className="line"></div>
          <div className="circle">5</div>
        </div>
        <form className="combinedForms" onSubmit={handleClick}>
          <DaoForm
            className="form one"
            title="Jaza fomu hii kufungua kikundi"
            description="Taarifa za awali ya kikundi chako"
            fields={[
              { label: "Jina la kikundi", type: "text" },
              { label: "Mahali kilipo", type: "text" },
              { label: "Kikundi ni cha kina nani", type: "text" },
              { label: "Kiwango cha kuanzia", type: "number" },
            ]}
          />

          <DaoForm
            className="form two"
            title="Kuhusu kikundi"
            description="Taarifa za maelezo mafupi kuhusu kikundi chako na nia yenu."
            fields={[
              { label: "Kichwa cha Juu", type: "text" },
              { label: "Maelezo mafupi/utangulizi", type: "textarea" },
              { label: "Maerezo marefu", type: "textarea" },
              { label: "", type: "file" },
            ]}
          />

          <MemberForm />

          <DaoForm
            className="hazina"
            title="Hazina ya kikundi"
            description="Taarifa na maelezo ya kifedha ya kikundi"
            fields={[
              {
                label: "Unganisha multi-sig wallet/acc for your kikundi",
                type: "button",
                name: "connect-wallet",
                id: "connect-wallet",
              },
              {
                label: "Andika akaunti namba ambayo itapokea fedha za kikundi",
                type: "text",
              },
            ]}
          />
          <div className="button-container">
            <button className="createDao">Create DAO</button>
          </div>
        </form>
      </main>
      <Footer className={""} />
    </>
  );
};

export default DaoRegistration;
