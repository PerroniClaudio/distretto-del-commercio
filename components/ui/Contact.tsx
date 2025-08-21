import { Icon } from "design-react-kit";
import { ComuneContatto } from "@/types/comune";

interface ContactProps {
  contact: ComuneContatto;
  className?: string;
}

export default function Contact({ contact, className = "" }: ContactProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return 'it-mail';
      case 'phone': return 'it-telephone';
      case 'fax': return 'it-print';
      case 'whatsapp': return 'it-comment';
      case 'website': return 'it-external-link';
      case 'instagram': return 'it-instagram';
      case 'facebook': return 'it-facebook';
      default: return 'it-telephone';
    }
  };

  const getDefaultTitle = (type: string) => {
    switch (type) {
      case 'email': return 'Email';
      case 'phone': return 'Telefono';
      case 'fax': return 'Fax';
      case 'whatsapp': return 'WhatsApp';
      case 'website': return 'Sito Web';
      case 'instagram': return 'Instagram';
      case 'facebook': return 'Facebook';
      default: return type;
    }
  };

  const renderContactValue = () => {
    switch (contact.type) {
      case 'email':
        return (
          <a href={`mailto:${contact.value}`} className="text-decoration-none">
            {contact.value}
          </a>
        );
      case 'phone':
      case 'fax':
        return (
          <a href={`tel:${contact.value}`} className="text-decoration-none">
            {contact.value}
          </a>
        );
      case 'whatsapp':
        return (
          <a 
            href={`https://wa.me/${contact.value.replace(/\D/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            {contact.value}
          </a>
        );
      case 'website':
        return (
          <a 
            href={contact.value.startsWith('http') ? contact.value : `https://${contact.value}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            {contact.value}
          </a>
        );
      case 'instagram':
        return (
          <a 
            href={`https://instagram.com/${contact.value.replace('@', '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            @{contact.value.replace('@', '')}
          </a>
        );
      case 'facebook':
        return (
          <a 
            href={contact.value.startsWith('http') ? contact.value : `https://facebook.com/${contact.value}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            {contact.value}
          </a>
        );
      default:
        return <span>{contact.value}</span>;
    }
  };

  return (
    <div className={`d-flex align-items-center p-3 border rounded ${className}`}>
      <Icon
        className="icon-sm me-3"
        color="primary"
        icon={getIcon(contact.type)}
      />
      <div className="flex-grow-1">
        <h6 className="mb-1">
          {contact.title || getDefaultTitle(contact.type)}
        </h6>
        {renderContactValue()}
      </div>
    </div>
  );
}
