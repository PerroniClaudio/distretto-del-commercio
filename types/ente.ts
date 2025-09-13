export interface EnteContatto {
  title?: string;
  type: 'email' | 'phone' | 'fax' | 'whatsapp' | 'website' | 'instagram' | 'facebook';
  value: string;
}

export interface Ente {
  _id: string;
  title: string;
  slug: { current: string };
  image?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  description?: any; // PortableText
  raggruppaInNavbar?: boolean;
  canPublishAlone?: boolean;
  contacts?: EnteContatto[];
}

export type PopulatedEnte = Ente;