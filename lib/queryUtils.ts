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


/**
 * Condizioni di visibilità comuni per le query delle notizie
 * Queste condizioni assicurano che vengano mostrati solo gli eventi:
 * - Non nascosti (hidden != true o hidden non definito)
 * - Con data di pubblicazione obbligatoriamente definita e valida (publishedAt <= now())
 * - Con data di fine pubblicazione, se definita, valida (publishedTo >= now())
 */
export const NEWS_VISIBILITY_CONDITIONS = `(!defined(hidden) || hidden != true) &&
    (defined(publishedAt) && publishedAt <= now()) &&
    (!defined(publishedTo) || publishedTo >= now())`;