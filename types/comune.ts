import { PortableTextBlock } from "next-sanity";

export interface ComuneContatto {
  title?: string;
  type: 'email' | 'phone' | 'fax' | 'whatsapp' | 'website' | 'instagram' | 'facebook';
  value: string;
}

export interface Comune {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  image?: {
    asset?: {
      url: string;
      _id: string;
    };
    alt?: string;
  };
  description?: PortableTextBlock[];
  contacts?: ComuneContatto[];
}