"use client";

import { Collapse, Dropdown, DropdownMenu, DropdownToggle, Header, HeaderContent, Headers, HeaderToggler, Icon, LinkList, LinkListItem, Nav, NavItem, NavLink } from "design-react-kit";
import Logo from "./Logo";
import Link from "next/link";
import { useState } from "react";
import { useComuni } from "../../hooks/useComuni";

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
    <Headers sticky>
      <div className="custom-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-wrapper">
              <Logo width={200} height={120} priority className="logo-image" />
            </div>
            <div className="social-links">
              <span className="follow-text">Seguici su</span>
              <Link
                aria-label="Facebook"
                href="#"
                target="_blank"
                className="social-link"
              >
                <Icon icon="it-facebook" />
              </Link>
              <Link
                aria-label="Instagram"
                href="#"
                target="_blank"
                className="social-link"
              >
                <Icon icon="it-instagram" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Header
        theme=""
        type="navbar"
        className="it-header navbar-primary"
      >
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
                          href={`/comuni/${comune.slug.current}`}
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

              <NavItem>
                <NavLink href="/eventi">
                  <span>Eventi</span>
                </NavLink>
              </NavItem>

            
            </Nav>
          </div>
        </Collapse>
      </HeaderContent>
    </Header>
    </Headers>
  )
}

export default Navigation