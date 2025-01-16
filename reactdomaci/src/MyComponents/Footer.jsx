import React from "react";

function Footer() {
  return (
    <footer className="info_section layout_padding2">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-3 info_col">
            <div className="info_contact">
              <h4>Kontakt</h4>
              <div className="contact_link_box">
                <a href="#!">
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                  <span>Jove Ilića, 11000 Beograd, Srbija</span>
                </a>
                <a href="#!">
                  <i className="fa fa-phone" aria-hidden="true"></i>
                  <span>+381 65324333</span>
                </a>
                <a href="#!">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                  <span>info@myfinance.com</span>
                </a>
              </div>
            </div>
            <div className="info_social">
              <a href="#!">
                <i className="fa fa-facebook" aria-hidden="true"></i>
              </a>
              <a href="#!">
                <i className="fa fa-twitter" aria-hidden="true"></i>
              </a>
              <a href="#!">
                <i className="fa fa-linkedin" aria-hidden="true"></i>
              </a>
              <a href="#!">
                <i className="fa fa-instagram" aria-hidden="true"></i>
              </a>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 info_col">
            <div className="info_detail">
              <h4>O Nama</h4>
              <p>
                Kroz MyFinance, naš cilj je da svako može lako da vodi lične
                finansije, bez obzira na nivo znanja ili prihode.
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-1 mx-auto info_col">
            <div className="info_link_box text-end">
              <h4>Linkovi</h4>
              <div className="info_links">
                <a href="">Početna</a> <br />
                <a href="#about">Informacije</a> <br />
                <a href="#services">Usluge</a> <br />
                <a href="login">Prijava</a> <br />
                <a href="register">Registracija</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer_section">
        <div className="container">
          <p>
            © {new Date().getFullYear()} Sva Prava Zadržana | MyFinance
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
