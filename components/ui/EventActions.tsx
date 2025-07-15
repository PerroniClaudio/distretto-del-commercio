"use client";

interface EventActionsProps {
  isUpcoming: boolean;
}

export default function EventActions({ isUpcoming }: EventActionsProps) {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleAddToCalendar = () => {
    // Qui puoi implementare la logica per aggiungere al calendario
    // Ad esempio, generare un file .ics o integrare con Google Calendar
    alert("Funzionalità in arrivo!");
  };

  return (
    <div className="d-flex gap-3 mb-5">
      <button 
        className="btn btn-outline-primary"
        onClick={handleGoBack}
      >
        <svg className="icon icon-sm me-2">
          <use href="/bootstrap-italia/dist/svg/sprites.svg#it-arrow-left"></use>
        </svg>
        Torna indietro
      </button>
      
      {isUpcoming && (
        <button 
          className="btn btn-primary"
          onClick={handleAddToCalendar}
        >
          <svg className="icon icon-sm me-2">
            <use href="/bootstrap-italia/dist/svg/sprites.svg#it-calendar-plus"></use>
          </svg>
          Aggiungi al calendario
        </button>
      )}
    </div>
  );
}