"use client";

import { useState } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Icon,
  Collapse,
  Nav,
  MegamenuItem,
  Row,
  MegamenuHighlightColumn,
  Col,
  LinkList,
  LinkListItem,
} from "design-react-kit";

function Navigation() {
  const [openNav, setOpenNav] = useState(false);
  const toggle = () => {
    setOpenNav(!openNav);
  };
  return (
    <Navbar expand="lg" className="has-megamenu">
      <NavbarBrand />
      <NavbarToggler className="custom-navbar-toggler" onClick={toggle}>
        <Icon icon="it-list" size="sm" />
      </NavbarToggler>
      <Collapse isOpen={openNav} navbar header megamenu>
        <Nav className="mt-0" navbar>
          <MegamenuItem itemName="Megamenu con Immagine e Descrizione">
            <Row>
              <MegamenuHighlightColumn xs="12" lg="4" description>
                <div className="ratio ratio-21x9 lightgrey-bg-a1 mb-4 rounded">
                  <figure className="figure">
                    <img
                      src="https://placehold.co/560x240/ebebeb/808080/?text=Immagine"
                      className="figure-img img-fluid rounded"
                      alt="Segnaposto"
                    />
                  </figure>
                </div>
                <p>
                  Omnis iste natus error sit voluptatem accusantium doloremque
                  laudantium, totam rem aperiam.
                </p>
              </MegamenuHighlightColumn>
              <Col xs="12" lg="8">
                <div className="it-heading-link-wrapper">
                  <a className="it-heading-link" href="#">
                    <Icon
                      className="icon icon-sm me-2 mb-1"
                      icon="it-arrow-right-triangle"></Icon>
                    <span>Esplora la sezione megamenu</span>
                  </a>
                </div>
                <Row>
                  <Col xs="12" lg="6">
                    <LinkList>
                      <LinkListItem inDropdown href="#">
                        <Icon
                          className="me-2"
                          color="primary"
                          icon="it-arrow-right-triangle"
                          size="xs"
                        />
                        <span>Link lista 1</span>
                      </LinkListItem>
                      <LinkListItem inDropdown href="#">
                        <Icon
                          className="me-2"
                          color="primary"
                          icon="it-arrow-right-triangle"
                          size="xs"
                        />
                        <span>Link lista 2</span>
                      </LinkListItem>
                      <LinkListItem inDropdown href="#">
                        <Icon
                          className="me-2"
                          color="primary"
                          icon="it-arrow-right-triangle"
                          size="xs"
                        />
                        <span>Link lista 3</span>
                      </LinkListItem>
                    </LinkList>
                  </Col>
                  <Col xs="12" lg="6">
                    <LinkList>
                      <LinkListItem inDropdown href="#">
                        <Icon
                          className="me-2"
                          color="primary"
                          icon="it-arrow-right-triangle"
                          size="xs"
                        />
                        <span>Link lista 4</span>
                      </LinkListItem>
                      <LinkListItem inDropdown href="#">
                        <Icon
                          className="me-2"
                          color="primary"
                          icon="it-arrow-right-triangle"
                          size="xs"
                        />
                        <span>Link lista 5</span>
                      </LinkListItem>
                      <LinkListItem inDropdown href="#">
                        <Icon
                          className="me-2"
                          color="primary"
                          icon="it-arrow-right-triangle"
                          size="xs"
                        />
                        <span>Link lista 6</span>
                      </LinkListItem>
                    </LinkList>
                  </Col>
                </Row>
              </Col>
            </Row>
          </MegamenuItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
}
export default Navigation;
