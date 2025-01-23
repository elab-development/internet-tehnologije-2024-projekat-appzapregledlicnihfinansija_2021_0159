import React from "react";
import heroBg from "./images/hero-bg.png";
import sliderImage from "./images/slider-img.png";
import aboutUs from "./images/about-img.png";
import { FaDollarSign, FaPiggyBank, FaChartLine } from "react-icons/fa";
import Footer from "./Footer";

function WelcomePage() {
  return (
    <div className="hero_area">
      {/* HERO BACKGROUND IMAGE */}
      <div className="hero_bg_box">
        <div className="bg_img_box">
          <img src={heroBg} alt="hero background" />
        </div>
      </div>

      {/* SLIDER SECTION */}
      <section className="slider_section">
        <div className="container">
          <div className="row align-items-center">
            {/* Text */}
            <div className="col-md-6">
              <div className="detail-box">
                <h1>
                  Lične <br />
                  Finansije
                </h1>
                <p>
                  Upravljaj svojim finansijama uz pomoć intuitivne aplikacije
                  koja ti pomaže da pratiš prihode, rashode, ciljeve štednje i
                  još mnogo toga.
                </p>
                <div className="btn-box">
                  <a href="#about" className="btn1">
                    Saznaj više
                  </a>
                </div>
              </div>
            </div>
            {/* Image */}
            <div className="col-md-6">
              <div className="img-box">
                <img src={sliderImage} alt="welcome finance" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="service_section layout_padding" id="services">
        <div className="service_container">
          <div className="container">
            <div className="heading_container heading_center">
              <h2>
                Naše <span>Usluge</span>
              </h2>
              <p>
                Sve što ti je potrebno za stabilan finansijski život na jednom
                mestu
              </p>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="box">
                  <div className="img-box">
                    <FaDollarSign size={75} color="#00bbf0" />
                  </div>
                  <div className="detail-box">
                    <h5>Praćenje rashoda</h5>
                    <p>
                      Jednostavno unosi i prati svoje svakodnevne troškove,
                      analiziraj ih po kategorijama i otkrij gde najviše odlazi
                      tvoj novac.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="box">
                  <div className="img-box">
                    <FaPiggyBank size={75} color="#00bbf0" />
                  </div>
                  <div className="detail-box">
                    <h5>Finansijski ciljevi</h5>
                    <p>
                      Postavi svoje ciljeve štednje, kreiraj realan plan i prati
                      napredak kroz vizuelne izveštaje.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="box">
                  <div className="img-box">
                    <FaChartLine size={75} color="#00bbf0" />
                  </div>
                  <div className="detail-box">
                    <h5>Budžetiranje</h5>
                    <p>
                      Napravi mesečni budžet prema tvojim navikama i prihodima.
                      Dobijaj notifikacije kada se približiš zadatim limitima.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about_section layout_padding" id="about">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>
              O <span>Nama</span>
            </h2>
            <p>
              Nauči kako da jednostavno i efikasno rasporediš svoj novac i
              ostvariš finansijsku nezavisnost.
            </p>
          </div>
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="img-box">
                <img src={aboutUs} alt="" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-box">
                <h3>Mi smo MyFinance</h3>
                <p>
                  Naša misija je da svakome omogućimo lak i jednostavan pristup
                  finansijskim alatima.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <Footer />
    </div>
  );
}

export default WelcomePage;
