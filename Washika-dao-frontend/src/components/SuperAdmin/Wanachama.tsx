import WanachamaList, { DaoDetails } from "./WanachamaList";

interface WanachamaProps {
  daoDetails?: DaoDetails;
}

export default function Wanachama({ daoDetails }: WanachamaProps) {
  return (
    <>
      <h2 className="heading">Taarifa za Wanachama</h2>
      <section className="fourth">
        <div className="search">
          <input type="search" name="" id="" placeholder="Search" />
          <img src="/images/Search.png" alt="" />
        </div>
        <WanachamaList daoDetails={daoDetails} />
      </section>
    </>
  );
}
