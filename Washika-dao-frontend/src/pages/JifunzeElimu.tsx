import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const JifunzeElimu: React.FC = () => {
  return (
    <>
      <NavBar className={""} />
      <main className="jifunze">
        <div className="onee">
          <div className="left">
            <h2>Karibu kwa WashikaDAO</h2>
            <p>
            Tunawezesha vikundi kufanikisha malengo yao kwa usawa na usalama wa
            mali zao
            </p>
          </div>
          
          <div className="image">
          <img src="images/LOGO SYMBLO(1).png" alt="logo" width="175" />
          </div>
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
        <div className="imagge">
        <img src="images/Frame 9.png" alt="" />
        </div>
      </main>
      <Footer className={""} />
    </>
  );
};

export default JifunzeElimu;
