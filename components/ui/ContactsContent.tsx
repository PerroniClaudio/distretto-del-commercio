"use client";

import { Container, Row, Col, Card, CardBody, Icon } from "design-react-kit";
import Contact from "./Contact";
import { ComuneContatto } from "@/types/comune";

interface ComuneWithContacts {
  _id: string;
  title: string;
  contacts: ComuneContatto[];
}

interface ContactsContentProps {
  comuni: ComuneWithContacts[];
}

export default function ContactsContent({ comuni }: ContactsContentProps) {
  return (
    <Container className="my-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <div className="mb-4">
            <h1 className="mb-4">Contatti</h1>
            <p className="">
              Trova tutti i contatti dei comuni del Distretto del Commercio della Martesana
            </p>
            <p className="">
              Per comunicazioni riguardanti il distretto del commercio si deve fare riferimento
              ai contatti del <strong>Comune di Pessano con Bornago</strong>, in quanto comune capo convenzione.
            </p>
          </div>


          {comuni.length === 0 ? (
            <Card className="text-center py-5">
              <CardBody>
                <Icon
                  className="icon-lg mb-3"
                  color="secondary"
                  icon="it-telephone"
                />
                <h5>Nessun contatto disponibile</h5>
                <p className="text-muted">
                  Al momento non ci sono contatti disponibili per i comuni.
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="d-flex flex-column gap-3">
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
