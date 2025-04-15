import Cards from "./Cards";

export default function Mikopo() {
  return (
    <>
      <h2 className="heading">List of All members with loans</h2>
      <section className="thirdy">
        <div className="left">
          <div className="one components">
            <h2>Keywords</h2>
            <ul>
              <li>
                Jina <img src="/images/X.png" alt="" />
              </li>
              <li>
                Kiasi <img src="/images/X.png" alt="" />
              </li>
              <li>
                Ada <img src="/images/X.png" alt="" />
              </li>
            </ul>
          </div>
          <div className="two components">
            <div className="content">
              <input type="checkbox" name="" id="" />
              <div>
                <label>Label</label>
                <p>Description</p>
              </div>
            </div>
            <div className="content">
              <input type="checkbox" name="" id="" />
              <div>
                <label>Label</label>
                <p>Description</p>
              </div>
            </div>
            <div className="content">
              <input type="checkbox" name="" id="" />
              <div>
                <label>Label</label>
                <p>Description</p>
              </div>
            </div>
          </div>
          <div className="components">
            <div>
              <label>Label</label>
              <p>$0 - 10,000</p>
            </div>
            <input type="range" name="" id="" />
          </div>
          <div className="two components">
            <h2>Color</h2>
            <div className="content">
              <input type="checkbox" name="" id="" />
              <label>Label</label>
            </div>
            <div className="content">
              <input type="checkbox" name="" id="" />
              <label>Label</label>
            </div>
            <div className="content">
              <input type="checkbox" name="" id="" />
              <label>Label</label>
            </div>
          </div>
          <div className="components">
            <h2>Size</h2>
            <div className="content">
              <input type="checkbox" name="" id="" />
              <label>Label</label>
            </div>
            <div className="content">
              <input type="checkbox" name="" id="" />
              <label>Label</label>
            </div>
            <div className="content">
              <input type="checkbox" name="" id="" />
              <label>Label</label>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="one">
            <div className="search">
              <input type="search" name="" id="" placeholder="Search" />
              <img src="/images/Search.png" alt="" />
            </div>

            <div className="sort active">
              <img src="/images/Check.png" alt="" />
              Mikopo Mipya
            </div>
            <div className="sort">Mikopo inayo daiwa</div>
            <div className="sort">Mikopo iliyo lipwa</div>
            <div className="sort">Ada</div>
          </div>
          <Cards />
        </div>
      </section>
    </>
  );
}
