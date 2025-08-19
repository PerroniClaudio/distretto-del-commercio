import React from "react";
import { PopulatedEvent } from "@/types/event";

/**
 * Formatta le date di un evento in formato leggibile italiano
 * @param evnt - L'evento da formattare
 * @returns JSX.Element contenente la data formattata
 */
export const getDateStringFromTo = (evnt: PopulatedEvent | null): React.JSX.Element => {
  if (!evnt?.date) return <></>;
  
  const startDate = new Date(evnt.date);
  const endDate = evnt.dateEnd ? new Date(evnt.dateEnd) : null;
  
  // Opzioni di formattazione comuni
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    ...dateOptions,
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };
  
  // Controlli per orari
  const isStartMidnight = startDate.getHours() === 0 && startDate.getMinutes() === 0;
  const isEndOfDay = endDate?.getHours() === 23 && endDate?.getMinutes() === 59;
  const isSameDay = !endDate || startDate.toDateString() === endDate.toDateString();
  
  if (isSameDay) {
    // Evento nello stesso giorno
    const baseDate = startDate.toLocaleDateString('it-IT', dateOptions);
    
    if (isStartMidnight && (!endDate || isEndOfDay)) {
      return <>{`${baseDate} Tutto il giorno`}</>;
    }
    
    const startTime = startDate.toLocaleTimeString('it-IT', timeOptions);
    const endTime = endDate ? ` alle ore ${endDate.toLocaleTimeString('it-IT', timeOptions)}` : '';
    
    return <>{`${baseDate} Dalle ore ${startTime}${endTime}`}</>;
  }
  
  // Evento multi-giorno
  return (
    <>
      Da {startDate.toLocaleString('it-IT', dateTimeOptions)}
      {endDate && (
        <>
          <br />
          A {endDate.toLocaleString('it-IT', dateTimeOptions)}
        </>
      )}
    </>
  );
};
