"use client";

import { useState } from "react";
import { useComuni } from "../../hooks/useComuni";

import {
  Icon,
  Collapse,
  Nav,
  MegamenuItem,
  Row,
  MegamenuHighlightColumn,
  Col,
  LinkList,
  LinkListItem,
  Header,
  HeaderContent,
  HeaderToggler,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "design-react-kit";

function Navigation() {
  const [openNav, setOpenNav] = useState(false);
  const { comuni, loading, error } = useComuni();

  const toggle = () => {
    setOpenNav(!openNav);
  };

  const handleOverlayClick = () => {
    setOpenNav(false);
  };

  return (
    <Header
      theme=""
      type="navbar"
      className="it-header navbar-primary sticky-top">
      <HeaderContent expand="lg" megamenu>
        <HeaderToggler
          aria-controls="nav1"
          aria-expanded={openNav}
          aria-label="Toggle navigation"
          onClick={toggle}>
          <Icon icon="it-burger" />
        </HeaderToggler>
        <Collapse
          header
          navbar
          isOpen={openNav}
          onOverlayClick={handleOverlayClick}>
          <div className="menu-wrapper">
            <Nav navbar>
              <NavItem>
                <NavLink href="/">
                  <span>Home</span>
                </NavLink>
              </NavItem>

              {loading ? (
                <NavItem>
                  <NavLink disabled href="#">
                    <span>Caricamento...</span>
                  </NavLink>
                </NavItem>
              ) : error ? (
                <NavItem>
                  <NavLink disabled href="#">
                    <span>Errore nel caricamento</span>
                  </NavLink>
                </NavItem>
              ) : comuni.length > 0 ? (
                <Dropdown inNavbar tag="li" theme="">
                  <DropdownToggle caret>
                    <span>Comuni</span>
                  </DropdownToggle>
                  <DropdownMenu>
                    <LinkList>
                      {comuni.map((comune) => (
                        <LinkListItem
                          key={comune._id}
                          href={`/${comune.slug.current}`}
                          inDropdown>
                          <span>{comune.title}</span>
                        </LinkListItem>
                      ))}
                    </LinkList>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <NavItem>
                  <NavLink disabled href="#">
                    <span>Nessun comune trovato</span>
                  </NavLink>
                </NavItem>
              )}

              <MegamenuItem itemName="Megamenu con Immagine e Descrizione">
                <Row>
                  <MegamenuHighlightColumn description lg="4" xs="12">
                    <div className="ratio ratio-21x9 lightgrey-bg-a1 mb-4 rounded">
                      <figure className="figure">
                        <img
                          alt="Segnaposto"
                          className="figure-img img-fluid rounded"
                          src="https://placehold.co/560x240/ebebeb/808080/?text=Immagine"
                        />
                      </figure>
                    </div>
                    <p>
                      Omnis iste natus error sit voluptatem accusantium
                      doloremque laudantium, totam rem aperiam.
                    </p>
                  </MegamenuHighlightColumn>
                  <Col lg="8" xs="12">
                    <div className="it-heading-link-wrapper">
                      <a className="it-heading-link" href="#">
                        <Icon
                          className="icon icon-sm me-2 mb-1"
                          icon="it-arrow-right-triangle"
                        />
                        <span>Esplora la sezione megamenu</span>
                      </a>
                    </div>
                    <Row>
                      <Col lg="6" xs="12">
                        <LinkList>
                          <LinkListItem href="#" inDropdown>
                            <Icon
                              className="me-2"
                              color="primary"
                              icon="it-arrow-right-triangle"
                              size="xs"
                            />
                            <span>Link lista 1</span>
                          </LinkListItem>
                          <LinkListItem href="#" inDropdown>
                            <Icon
                              className="me-2"
                              color="primary"
                              icon="it-arrow-right-triangle"
                              size="xs"
                            />
                            <span>Link lista 2</span>
                          </LinkListItem>
                          <LinkListItem href="#" inDropdown>
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
                      <Col lg="6" xs="12">
                        <LinkList>
                          <LinkListItem href="#" inDropdown>
                            <Icon
                              className="me-2"
                              color="primary"
                              icon="it-arrow-right-triangle"
                              size="xs"
                            />
                            <span>Link lista 4</span>
                          </LinkListItem>
                          <LinkListItem href="#" inDropdown>
                            <Icon
                              className="me-2"
                              color="primary"
                              icon="it-arrow-right-triangle"
                              size="xs"
                            />
                            <span>Link lista 5</span>
                          </LinkListItem>
                          <LinkListItem href="#" inDropdown>
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
          </div>
        </Collapse>
      </HeaderContent>
    </Header>
  );
}
export default Navigation;
