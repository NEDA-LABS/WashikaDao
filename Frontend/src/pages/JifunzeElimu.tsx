import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const JifunzeElimu: React.FC = () => {
    return (
        <>
        <NavBar className={""}/>
        <main>
      <div>
        <h2>Karibu kwa WashikaDAO</h2>
        <p>
          Tunawezesha vikundi kufanikisha malengo yao kwa usawa na usalama wa
          mali zao
        </p>
        <div className="image"></div>
      </div>

      <div>
        <article>
          <h2>Fungua DAO</h2>
          <p>
            Tumia mfumo wetu wa kisasa kuendesha na kukuza Kikundi chako cha
            kifedha
          </p>
        </article>
        <article>
          <h2>Jifunze kuhusu DAO</h2>
          <p>
            Pata Elimu na makala kuhusu Uchumi wa kidijitali unavyoweza
            kukusaidia wewe na kikundi cheka kufikia malengo yenu
          </p>
        </article>
        <article>
          <h2>DAO Tool kit</h2>
          <p>Kila kitu unachohitaji kujua kuhusu DAO. Anza leo kushiriki.</p>
        </article>
      </div>

      <div>
        <div>
          <img src="" alt="" />
          <p>Fahamu kuhusu <span>Vikoba Vya Kidijitali</span></p>
        </div>
        <div>
          <img src="" alt="" />
          <p>Empowering everyday <span>waste pickers</span></p>
        </div>
      </div>
    </main>
        <Footer className={""}/>
        </>
    )
}

export default JifunzeElimu;