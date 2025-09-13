"use client";

import { Collapse, Dropdown, DropdownMenu, DropdownToggle, Header, HeaderContent, HeaderRightZone, Headers, HeaderToggler, Icon, LinkList, LinkListItem, Nav, NavItem, NavLink } from "design-react-kit";
import Logo from "./Logo";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useComuni } from "../../hooks/useComuni";
import { useEnti } from "@/hooks/useEnti";

function Navigation() {

  const [openNav, setOpenNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { comuni, loading: loadingComuni, error: errorComuni } = useComuni();
  const { enti, loading: loadingEnti, error: errorEnti } = useEnti();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // 180 sembra adatto ad evitare che si attivi troppo in basso o troppo in alto. 
      // Può essere modificato, ma bisogna controllare sia versione mobile che desktop.
      setIsScrolled(prevIsScrolled => {
        if (scrollTop > 180 && !prevIsScrolled) {
          return true;
        } else if (scrollTop < 180 && prevIsScrolled) {
          return false;
        }
        return prevIsScrolled;
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Dipendenze vuote - l'event listener viene creato solo una volta

  const toggle = () => {
    setOpenNav(!openNav);
  };

  const handleOverlayClick = () => {
    setOpenNav(false);
  };


  return (
    <Headers sticky>
      <div 
        className={`center-header-wrapper ${isScrolled ? 'hidden' : 'visible'}`}
        style={{
          maxHeight: isScrolled ? '0' : '164px',
          opacity: isScrolled ? 0 : 1,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {/* <div className="custom-header">
          <div className="container-xxl">
            <div className="header-content">
              <div className="header-regione-wrapper">
                <div className="header-logo-regione">
                  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" object-fit="cover" viewBox="0 0 600 600">
                    <rect width="600" height="600" fill="#2e7123"/>
                    <path d="m 357.56254,100.73418 c -7.97022,-.0593 -16.07931,1.41422 -23.90625,4.65625 -31.29869,12.96434 -46.16695,48.85488 -33.21875,80.15625 l -.25,.0937 c .004,.009 -.004,.0224 0,.0312 9.27954,22.40279 -1.37845,48.09545 -23.78125,57.375 -22.4028,9.27954 -48.06421,-1.3472 -57.34375,-23.75 -.005,-.0126 -.026,-.0186 -.0312,-.0312 l -.25,.0937 c -9.73213,-23.46499 -32.34835,-37.66578 -56.25,-37.84375 -7.97022,-.0594 -16.07931,1.44547 -23.90625,4.6875 -31.30777,12.9681 -46.186851,48.84847 -33.21875,80.15625 12.96434,31.29869 48.85489,46.16695 80.15625,33.21875 l .0937,.25 .0312,0 c 5.6007,-2.31989 11.42177,-3.38622 17.125,-3.34375 17.10968,.1274 33.29034,10.29165 40.25,27.09375 9.27954,22.40279 -1.37845,48.09546 -23.78125,57.375 l .0937,.25 c -31.28959,12.97742 -46.15192,48.8886 -33.1875,80.1875 12.9681,31.30777 48.87973,46.1556 80.1875,33.1875 31.29869,-12.96434 46.13572,-48.82366 33.1875,-80.125 l .28125,-.125 c -9.27954,-22.4028 1.3472,-48.09546 23.75,-57.375 5.6007,-2.31989 11.42177,-3.38622 17.125,-3.34375 17.10968,.1274 33.2903,10.29165 40.25,27.09375 .004,.009 -.004,.0222 0,.0312 l .25,-.0937 c 12.9774,31.28957 48.8572,46.12067 80.1563,33.15625 31.3075,-12.9681 46.1868,-48.84848 33.2187,-80.15625 -9.7261,-23.48083 -32.3393,-37.72821 -56.25,-37.90625 -7.9702,-.0593 -16.0793,1.44547 -23.9063,4.6875 l -.0937,-.25 -.0313,0 c -22.4026,9.27954 -48.0642,-1.34721 -57.3437,-23.75 -9.27954,-22.4028 1.3472,-48.09546 23.75,-57.375 l -.0937,-.25 c 31.2896,-12.97743 46.1521,-48.8886 33.1874,-80.1875 -9.7258,-23.48083 -32.3393,-37.69696 -56.24995,-37.875 z" fill="white"/>
                  </svg>
                </div>
                <div className="header-text-lg">
                  Regione lombardia
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Center */}
        <Header
          theme=""
          type="center"
        >
          <HeaderContent>
            {/* <HeaderBrand
              iconAlt="it code circle icon"
              iconName="it-code-circle"
            >
              <h2>
                Distretto del Commercio della Martesana
              </h2>
              <h3>
                Inserire qui la tag line
              </h3>
            </HeaderBrand> */}
            <div className="header-brand-custom">
              <div className="logo-wrapper">
                <Logo width={200} height={150} priority className="logo-image" />
              </div>
              <h2>
                Distretto del Commercio della Martesana
              </h2>
            </div>
            <HeaderRightZone>
              <div className="d-flex flex-column gap-2 header-right-wrapper">
                <div className="header-regione-wrapper">
                  <div className="header-logo-regione">
                    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" object-fit="cover" viewBox="0 0 600 600">
                      <rect width="600" height="600" fill="#2e7123"/>
                      <path d="m 357.56254,100.73418 c -7.97022,-.0593 -16.07931,1.41422 -23.90625,4.65625 -31.29869,12.96434 -46.16695,48.85488 -33.21875,80.15625 l -.25,.0937 c .004,.009 -.004,.0224 0,.0312 9.27954,22.40279 -1.37845,48.09545 -23.78125,57.375 -22.4028,9.27954 -48.06421,-1.3472 -57.34375,-23.75 -.005,-.0126 -.026,-.0186 -.0312,-.0312 l -.25,.0937 c -9.73213,-23.46499 -32.34835,-37.66578 -56.25,-37.84375 -7.97022,-.0594 -16.07931,1.44547 -23.90625,4.6875 -31.30777,12.9681 -46.186851,48.84847 -33.21875,80.15625 12.96434,31.29869 48.85489,46.16695 80.15625,33.21875 l .0937,.25 .0312,0 c 5.6007,-2.31989 11.42177,-3.38622 17.125,-3.34375 17.10968,.1274 33.29034,10.29165 40.25,27.09375 9.27954,22.40279 -1.37845,48.09546 -23.78125,57.375 l .0937,.25 c -31.28959,12.97742 -46.15192,48.8886 -33.1875,80.1875 12.9681,31.30777 48.87973,46.1556 80.1875,33.1875 31.29869,-12.96434 46.13572,-48.82366 33.1875,-80.125 l .28125,-.125 c -9.27954,-22.4028 1.3472,-48.09546 23.75,-57.375 5.6007,-2.31989 11.42177,-3.38622 17.125,-3.34375 17.10968,.1274 33.2903,10.29165 40.25,27.09375 .004,.009 -.004,.0222 0,.0312 l .25,-.0937 c 12.9774,31.28957 48.8572,46.12067 80.1563,33.15625 31.3075,-12.9681 46.1868,-48.84848 33.2187,-80.15625 -9.7261,-23.48083 -32.3393,-37.72821 -56.25,-37.90625 -7.9702,-.0593 -16.0793,1.44547 -23.9063,4.6875 l -.0937,-.25 -.0313,0 c -22.4026,9.27954 -48.0642,-1.34721 -57.3437,-23.75 -9.27954,-22.4028 1.3472,-48.09546 23.75,-57.375 l -.0937,-.25 c 31.2896,-12.97743 46.1521,-48.8886 33.1874,-80.1875 -9.7258,-23.48083 -32.3393,-37.69696 -56.24995,-37.875 z" fill="white"/>
                    </svg>
                  </div>
                  <div className="header-text-lg text-nowrap fs-5 fw-bold">
                    Regione lombardia
                  </div>
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
              {/* <HeaderSearch
                iconName="it-search"
                label="Cerca"
              /> */}
            </HeaderRightZone>
          </HeaderContent>
        </Header>
      </div>

      {/* Navigation */}
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
                
                <NavItem>
                  <NavLink href="/enti/distretto-del-commercio">
                    <span>Chi siamo</span>
                  </NavLink>
                </NavItem>

                {loadingComuni ? (
                  <NavItem>
                    <NavLink disabled href="#">
                      <span>Caricamento...</span>
                    </NavLink>
                  </NavItem>
                ) : errorComuni ? (
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
                ) : (<></>)
                }

                <NavItem>
                  <NavLink href="/enti/confcommercio">
                    <span>Confcommercio</span>
                  </NavLink>
                </NavItem>

                {loadingEnti ? (
                  <NavItem>
                    <NavLink disabled href="#">
                      <span>Caricamento enti...</span>
                    </NavLink>
                  </NavItem>
                ) : errorEnti ? (
                  <NavItem>
                    <NavLink disabled href="#">
                      <span>Errore nel caricamento enti</span>
                    </NavLink>
                  </NavItem>
                ) : enti.filter(ente => 
                    ente.slug.current !== 'confcommercio' && 
                    ente.slug.current !== 'distretto-del-commercio'
                  ).length > 0 ? (
                  <Dropdown inNavbar tag="li" theme="">
                    <DropdownToggle caret>
                      <span>Enti</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <LinkList>
                        {enti
                          .filter(ente => 
                            ente.slug.current !== 'confcommercio' && 
                            ente.slug.current !== 'distretto-del-commercio'
                          )
                          .map((ente) => (
                            <LinkListItem
                              key={ente._id}
                              href={`/enti/${ente.slug.current}`}
                              inDropdown>
                              <span>{ente.title}</span>
                            </LinkListItem>
                          ))}
                      </LinkList>
                    </DropdownMenu>
                  </Dropdown>
                ) : (<></>)
                }

                <NavItem>
                  <NavLink href="/eventi">
                    <span>Eventi</span>
                  </NavLink>
                </NavItem>
                
                <NavItem>
                  <NavLink href="/notizie">
                    <span>Notizie</span>
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink href="/attivita-commerciali">
                    <span>Attività commerciali</span>
                  </NavLink>
                </NavItem>
                
                <NavItem>
                  <NavLink href="/contatti">
                    <span>Contatti</span>
                  </NavLink>
                </NavItem>
                
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
              </Nav>
            </div>
          </Collapse>
        </HeaderContent>
      </Header>
    </Headers>
  )
}

export default Navigation