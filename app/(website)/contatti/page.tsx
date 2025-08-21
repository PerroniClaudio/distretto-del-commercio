import { sanityFetch } from "@/sanity/lib/live";
import { ComuneContatto } from "@/types/comune";
import ContactsContent from "@/components/ui/ContactsContent";

interface ComuneWithContacts {
  _id: string;
  title: string;
  contacts: ComuneContatto[];
}

async function getContacts(): Promise<ComuneWithContacts[]> {
  const contactsQuery = `*[_type == "comune" && defined(contacts) && count(contacts) > 0] | order(title asc) {
    _id,
    title,
    contacts
  }`;

  const { data } = await sanityFetch({
    query: contactsQuery,
    params: {},
  });

  // Ordina i comuni mettendo Pessano con Bornago per primo
  return data.sort((a: ComuneWithContacts, b: ComuneWithContacts) => {
    if (a.title === "Pessano con Bornago") return -1;
    if (b.title === "Pessano con Bornago") return 1;
    return a.title.localeCompare(b.title);
  });
}

export default async function ContactsPage() {
  const comuni = await getContacts();
  return <ContactsContent comuni={comuni} />;
}
