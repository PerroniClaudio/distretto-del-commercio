"use client";

import Link from "next/link";
import Logo from "./Logo";
import {
  Col,
  Container,
  Row,
} from "design-react-kit";

function FooterSection() {
  return (
    <footer className="it-footer">
      <div className="it-footer-main">
        <Container>
          <section>
            <Row className="clearfix">
              <Col sm={12}>
                <div className="it-brand-wrapper">
                  <a className="" href="#">
                    <Logo width={220} height={122} />
                    <div className="it-brand-text mx-4">
                      <h2>Distretto del Commercio della Martesana</h2>
                      <h3 className="d-none d-md-block">
                      Novità delle aziende e attività commerciali di
                      Pessano, Cambiago, Gessate, Bellinzago e Pozzuolo Martesana
                      </h3>
                    </div>
                  </a>
                </div>
              </Col>
            </Row>
          </section>
       
        </Container>
      </div>
      <div className="it-footer-small-prints clearfix">
        <Container>
          <h3 className="visually-hidden">Sezione Link Utili</h3>
          <ul className="it-footer-small-prints-list list-inline mb-0 d-flex flex-column flex-md-row">
            <li className="list-inline-item">
              <Link href="/privacy-policy" title="Privacy-Cookies">
                Privacy policy
              </Link>
            </li>
            <li className="list-inline-item">
            <Link href="/cookie-policy" title="Privacy-Cookies">
                Cookie policy
                </Link>
            </li>
            <li className="list-inline-item">
            <Link href="/note-legali" title="Note Legali">
                Note legali
                </Link>
            </li>
            <li className="list-inline-item">
            <Link href="/sitemap" title="Mappa del sito">
                Mappa del sito
                </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
export default FooterSection;
