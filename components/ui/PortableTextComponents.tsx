import { urlFor } from "@/sanity/lib/image";

interface ImageValue {
  asset?: {
    _ref: string;
    _type: string;
  };
  alt?: string;
  caption?: string;
}

export const portableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset) return null;

      return (
        <figure className="my-4">
          <img
            src={urlFor(value.asset)
              .auto("format")
              .url()}
            alt={value.alt || ""}
            className="w-full h-auto rounded"
            style={{
              maxWidth: '100%',
              maxHeight: '600px',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="text-center text-muted mt-2 small">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};
