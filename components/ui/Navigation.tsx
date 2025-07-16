"use client";

import { useState } from "react";
import { useComuni } from "../../hooks/useComuni";

import {
  Icon,
  Collapse,
  Nav,
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
  );
}
export default Navigation;
