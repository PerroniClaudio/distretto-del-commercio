// Custom types for Sanity documents
export interface StaticPage {
  _id: string;
  _type: "static_page";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: {
    current: string;
    _type: "slug";
  };
  content: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  publishedAt?: string;
  lastModified?: string;
}