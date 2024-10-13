import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import GroupInfo from "../components/GroupInfo";

import ConnectWallet from "../components/auth/ConnectWallet";
import TestDao from "./TestDao";
/** Thirdweb imports **/

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleDaoRegistration = () => {
    navigate("/DaoRegistration");
  };
  const handleJifunzeElimu = () => {
    navigate("/JifunzeElimu");
  };

  return (
    <>
      <NavBar className={""} />
      <main>
        <section className="image-container">
          <div className="inner-container">
            <img
              src="images/LOGO FULL.png"
              alt="logo"
              width="246"
              height="180"
            />
            <p className="main">
              Uongozi wa <br />
              Kidijitali kwa <br />
              Vikundi vya kifedha
            </p>
            <p>
              Tumia teknologia yetu kuunda, kuendesha <br />
              na kuboresha vikundi vidogo vya kiuchumi
            </p>
          </div>
        </section>

        <div className="buttons">
          <button className="button-1" onClick={handleDaoRegistration}>
            Fungua DAO
          </button>
          <button className="button-2" onClick={handleJifunzeElimu}>
            DAO ni nini?
          </button>
          {/**Testing thirdweb modal button*/}
          <ConnectWallet />
        </div>

        <p className="parag-container">
          Tunawezesha vikundi kutunza kumbukumbu zao, kufanya maamuzi na kupata
          faida nyingi
        </p>

        <section className="main-container">
          <div className="boxes">
            <div className="box one">
              <div className="box-left">
                <h1>Salama na Kisasa</h1>
                <p>
                  Fahamu kila kitu kuhusu kikundi chako kama vile
                  <span> kiwango kilichopo, hisa za wanakikundi</span> na jinsi
                  ya kupata <span>mikopo</span>.
                </p>
              </div>
              <div className="box-right">
                <div>
                  <img src="images/LOGO SYMBLO(1).png" alt="logo" width="63" />
                  <a href="Homepage.html">
                    <img src="images/wordlogo.png" alt="logo" width="253" />
                  </a>
                </div>
              </div>
            </div>

            <div className="box two">
              <div className="box-left two">
                <h1>Elimu ya kifedha</h1>
                <p>
                  Pata mafunzo mbali mbali ya Elimu ya
                  <span> Uchumi wa kidijitali</span>. Fahamu jinsi gani na wewe
                  unaweza kunufaika na Teknolojia
                </p>
              </div>
              <div className="box-right"></div>
            </div>

            <div className="half-box box-left">
              <h1>Pata mikopo kirahisi</h1>
              <p>
                Kuza kipata chako kwa kupata
                <span> mikopo kirahisi kwa dhamana ya kikundi chako</span>.
                Jiunge na mtandao wetu wa wajasiriamali
              </p>
            </div>
          </div>

          <GroupInfo />
        </section>
        <div className="parag-container-two">
          <h2>Karibu kwa WashikaDAO</h2>
          <p className="sub-parag-container">
            Tunawezesha vikundi kufanikisha malengo yao kwa usawa na usalama wa
            mali zao
          </p>
        </div>

        <div className="article-container">
          <article className="one">
            <div>
              <h2>Fungua DAO</h2>
              <p>
                Tumia mfumo wetu wa kisasa kuendesha na kukuza Kikundi chako cha
                kifedha
              </p>
            </div>
          </article>
          <article className="two">
            <div>
              <h2>Jifunze kuhusu DAO</h2>
              <p>
                Pata Elimu na makala kuhusu Uchumi wa kidijitali unavyoweza
                kukusaidia wewe na kikundi cheka kufikia malengo yenu
              </p>
            </div>
          </article>
          <article className="three">
            <div>
              <h2>DAO Tool kit</h2>
              <p>
                Kila kitu unachohitaji kujua kuhusu DAO. Anza leo kushiriki.
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer className={""} />
    </>
  );
};

export default HomePage;
