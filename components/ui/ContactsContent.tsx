"use client";

import { Container, Row, Col, Card, CardBody, Icon } from "design-react-kit";
import Contact from "./Contact";
import { ComuneContatto } from "@/types/comune";

interface ComuneWithContacts {
  _id: string;
  title: string;
  contacts: ComuneContatto[];
}
interface EnteWithContacts {
  _id: string;
  title: string;
  contacts: ComuneContatto[];
}

interface ContactsContentProps {
  comuni: ComuneWithContacts[];
  enti: EnteWithContacts[];
}

export default function ContactsContent({ comuni, enti }: ContactsContentProps) {
  return (
    <Container className="my-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <div className="mb-4">
            <h1 className="mb-4">Contatti</h1>
            <p className="">
              Trova tutti i contatti del Distretto del Commercio della Martesana, dei suoi comuni e della Confcommercio
            </p>
          </div>
          
          {enti.length === 0 && comuni.length === 0 && (
            <Card className="card-bg border-bottom-card">
              <CardBody>
                <p className="mb-0">Nessun contatto disponibile al momento.</p>
              </CardBody>
            </Card>
          )}

          {enti.length > 0 && (
            <>
              <div className="d-flex flex-column gap-3 mb-5">
                {enti.map((ente) => (
                  <section key={ente._id}>
                    <div className="d-flex align-items-center mb-2">
                      <Icon
                        className="icon-sm me-3"
                        color="primary"
                        icon="it-pa"
                      />
                      <h4 className="mb-0">{ente.title}</h4>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      {ente.contacts.map((contact, index) => (
                        <Contact key={index} contact={contact} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}

          {comuni.length > 0 && (
            <div className="d-flex flex-column gap-3">
              <h2 className="mb-3">Comuni</h2>
              {comuni.map((comune) => (
                <section key={comune._id}>
                  <div className="d-flex align-items-center mb-2">
                    <Icon
                      className="icon-sm me-3"
                      color="primary"
                      icon="it-pa"
                    />
                    <h4 className="mb-0">{comune.title}</h4>
                  </div>
                  
                  <div className="d-flex flex-column gap-1">
                    {comune.contacts.map((contact, index) => (
                      <Contact key={index} contact={contact} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
