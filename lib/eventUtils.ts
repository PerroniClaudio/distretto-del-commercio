/**
 * Condizioni di visibilità comuni per le query degli eventi
 */

/**
 * Condizioni standard per la visibilità degli eventi
 * Queste condizioni assicurano che vengano mostrati solo gli eventi:
 * - Non nascosti (hidden != true o hidden non definito)
 * - Con data di pubblicazione valida (se definita)
 */
export const EVENT_VISIBILITY_CONDITIONS = `(!defined(hidden) || hidden != true) &&
    (!defined(publishedFrom) || publishedFrom < now()) &&
    (!defined(publishedTo) || publishedTo >= now())`;
