
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { editorClient } from "@/sanity/lib/editorClient";
  
export async function POST(req: Request) {
  try {
    // Parsing del file Excel con Web API nativa
    const formData = await req.formData();
    const file = formData.get("file");
    // In ambiente Node.js (produzione), File non esiste: controlla solo che sia un oggetto compatibile con Blob
    if (!file || typeof (file as Blob).arrayBuffer !== "function") {
      return NextResponse.json({ success: false, errors: ["Nessun file caricato o file non valido."] }, { status: 400 });
    }
    const buffer = await (file as Blob).arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // Imposta raw: false per riconoscere la formattazione e convertire automaticamente date/orari in stringa
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false }) as Record<string, string | number>[];

    // Validazione: tutti gli eventi devono avere nome, data inizio e comune esistente
    const errors: string[] = [];
    const eventDocs: Array<{ _type: string; [key: string]: unknown }> = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const title = typeof row["Nome Evento"] === "string" ? row["Nome Evento"].trim() : String(row["Nome Evento"] ?? "").trim();
      const rawDate = row["Data inizio"];
      const rawTime = row["Ora inizio"];
      // Conversione seriale Excel a stringa
      const dateStr = typeof rawDate === "number" ? excelDateToString(rawDate) : rawDate;
      const timeStr = typeof rawTime === "number" ? excelTimeToString(rawTime) : rawTime;
      let date: string | undefined;
      try {
        date = formatDate(dateStr, timeStr);
      } catch (err) {
        if (err instanceof Error) {
          errors.push(`Riga ${i + 2}: Errore data inizio: ${err.message}`);
        } else {
          errors.push(`Riga ${i + 2}: Errore data inizio: ${String(err)}`);
        }
        date = undefined;
      }

      const rawDateEnd = row["Data fine"];
      const rawTimeEnd = row["Ora fine"];
      let dateEnd: string | undefined;
      if (rawDateEnd) { 
        // Conversione seriale Excel a stringa
        const dateEndStr = typeof rawDateEnd === "number" ? excelDateToString(rawDateEnd) : rawDateEnd;
        const timeEndStr = typeof rawTimeEnd === "number" ? excelTimeToString(rawTimeEnd) : rawTimeEnd;
        try {
          // Se la data di fine è definita e l'orario anche allora calcoli dateEnd.
          // Se manca solo l'orario e la data di inizio è diversa allora crei un altro orario a fine giornata e lo usi per creare la data di fine.
          // Se la data di fine è uguale alla data di inizio, non impostare dateEnd
          if(timeEndStr){
            dateEnd = formatDate(dateEndStr, timeEndStr);
          } else if (dateEndStr === dateStr) {
            dateEnd = undefined;
          } else {
            dateEnd = formatDate(dateEndStr, "23:59");
          }
          // controlla se dateEnd è successiva a date, altrimenti restituisce errore con errors.push
          if (dateEnd && date && new Date(dateEnd) <= new Date(date)) {
            errors.push(`Riga ${i + 2}: La data di fine deve essere successiva alla data di inizio.`);
          }
        } catch (err) {
          if (err instanceof Error) {
            errors.push(`Riga ${i + 2}: Errore data fine: ${err.message}`);
          } else {
            errors.push(`Riga ${i + 2}: Errore data fine: ${String(err)}`);
          }
          dateEnd = undefined;
        }
      }

      const comuneName = typeof row["Comune  (singolo)"] === "string" ? row["Comune  (singolo)"]?.trim() : String(row["Comune  (singolo)"] ?? "").trim();
      const categoryName = typeof row["Categoria (singola)"] === "string" ? row["Categoria (singola)"]?.trim() : String(row["Categoria (singola)"] ?? "").trim();

      if (!title) {
        errors.push(`Riga ${i + 2}: Nome evento mancante.`);
      }
      if (!rawDate || typeof rawDate !== "string" || rawDate.trim() === "") {
        errors.push(`Riga ${i + 2}: Data inizio mancante o non valida. Valore raw: ${JSON.stringify(rawDate)}`);
      }
      if (rawTime && typeof rawTime !== "string") {
        errors.push(`Riga ${i + 2}: Ora inizio non valida. Valore raw: ${JSON.stringify(rawTime)}`);
      }
      if (date && !isValidDate(date)) {
        errors.push(`Riga ${i + 2}: Data inizio non valida. Data calcolata: ${date}, Valori raw: data=${JSON.stringify(rawDate)}, ora=${JSON.stringify(rawTime)}`);
      }
      let comuneId = undefined;
      if (comuneName){
        comuneId = await getComuneId(comuneName);
        if (!comuneId) {
          errors.push(`Riga ${i + 2}: Comune "${comuneName}" non trovato.`);
        }
      }
      let categoryId = undefined;
      if (categoryName) {
        categoryId = await getCategoryId(categoryName);
        if (!categoryId) {
          errors.push(`Riga ${i + 2}: Categoria "${categoryName}" non trovata.`);
        }
      }

      // Genera slug base
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      let slug = baseSlug;
      let suffix = 1;
      // Controlla se lo slug esiste già
      while (await slugExists(slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }

      eventDocs.push({
        _type: "event",
        title,
        slug: { _type: "slug", current: slug },
        date,
        dateEnd,
        comune: comuneId ? { _type: "reference", _ref: comuneId } : undefined,
        location: row["Luogo"],
        category: categoryId ? { _type: "reference", _ref: categoryId } : undefined,
        description: typeof row["Descrizione"] === "string"
          ? textToSanityBlocks(row["Descrizione"])
          : [],
      } as { _type: string; [key: string]: unknown });
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Se tutto ok, crea tutti gli eventi
    for (const eventDoc of eventDocs) {
      await editorClient.create(eventDoc);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Restituisci dettagli dell'errore in risposta
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

// Converte un seriale Excel (numero) in stringa data dd/mm/yyyy
function excelDateToString(serial: number): string {
  // Excel: 1 = 1900-01-01
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  const ms = serial * 24 * 60 * 60 * 1000;
  const date = new Date(excelEpoch.getTime() + ms);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

// Converte un seriale Excel (decimale) in stringa ora HH:mm
function excelTimeToString(serial: number): string {
  const totalMinutes = Math.round(serial * 24 * 60);
  const hour = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const min = String(totalMinutes % 60).padStart(2, "0");
  return `${hour}:${min}`;
}

// Controlla se esiste già uno slug per event
async function slugExists(slug: string) {
  const res = await editorClient.fetch(
    '*[_type == "event" && slug.current == $slug][0]{_id}',
    { slug }
  );
  return !!res?._id;
}

// Converte testo in blocchi Sanity (paragrafi e liste base)
function textToSanityBlocks(text: string) {
  if (!text || typeof text !== "string") return [];
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let currentList: Array<Record<string, unknown>> = [];
  // Funzione per generare un ID unico (simile a nanoid, ma senza moduli esterni)
  function uniqueKey(existingKeys: Set<string>): string {
    let key;
    do {
      key = (
        Date.now().toString(36) + Math.random().toString(36).substr(2, 6)
      ).replace(/\./g, "");
    } while (existingKeys.has(key));
    existingKeys.add(key);
    return key;
  }

  const existingKeys = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
      // Lista
      currentList.push({
        _type: "block",
        _key: uniqueKey(existingKeys),
        style: "normal",
        listItem: "bullet",
        children: [{ _type: "span", _key: uniqueKey(existingKeys), text: trimmed.replace(/^[-*]\s*/, "") }],
        markDefs: []
      } as Record<string, unknown>);
    } else if (trimmed) {
      // Paragrafo
      if (currentList.length) {
        blocks.push(...currentList);
        currentList = [];
      }
      blocks.push({
        _type: "block",
        _key: uniqueKey(existingKeys),
        style: "normal",
        children: [{ _type: "span", _key: uniqueKey(existingKeys), text: trimmed }],
        markDefs: []
      } as Record<string, unknown>);
    } else {
      // Riga vuota: chiudi eventuale lista
      if (currentList.length) {
        blocks.push(...currentList);
        currentList = [];
      }
    }
  }
  if (currentList.length) {
    blocks.push(...currentList);
  }
  return blocks;
}

// Al momento viene chiamato sempre utilizzando una stringa
function formatDate(dateStr: string, timeStr: string) {
  if (!dateStr) return undefined;
  let day, month, year;
  // Se la data è una stringa, assumiamo sempre dd/mm/yyyy
  if (typeof dateStr === "string") {
    const parts = dateStr.split("/");
    if (parts.length !== 3) throw new Error(`Data non valida: ${dateStr}`);
    day = parts[0];
    month = parts[1];
    year = parts[2];
    // Se l'anno è a due cifre, aggiungi 2000
    if (year.length === 2 && Number(year) < 100) {
      year = String(2000 + Number(year));
    }
    // Se il mese > 12, probabilmente giorno e mese sono invertiti
    if (Number(month) > 12) {
      throw new Error(`Formato data errato (inversione giorno/mese): ${dateStr}`);
    }
  } else if (typeof dateStr === "number") {
    // Se la data è un numero, è già convertita correttamente da excelDateToString
    return excelDateToString(Number(dateStr));
  } else {
    return undefined;
  }

  let hour = "00";
  let min = "00";
  if (typeof timeStr === "string" && timeStr.trim() !== "" && timeStr.trim().toLowerCase() !== "intera giornata") {
    const timeParts = timeStr.split(":");
    hour = timeParts[0]?.padStart(2, "0") || "00";
    min = timeParts[1]?.padStart(2, "0") || "00";
  }
  // ATTENZIONE: la data inserita è in fuso orario italiano (CET/CEST).
  // Per avere la stessa data/ora in Structure (Sanity), bisogna salvare la data in formato ISO locale (senza Z/fuso orario),
  // così Structure la mostra esattamente come inserita (senza conversione UTC).
  // In Vision invece, Sanity interpreta la data come UTC e la mostra "spostata" rispetto all'Italia.
  // Quindi, restituiamo una stringa ISO senza suffisso Z (es: "2024-06-10T15:00:00").
  const localIso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour}:${min}:00`;
  return localIso;
}

async function getComuneId(nome: string) {
  const res = await editorClient.fetch<{ _id: string } | null>(`*[_type == "comune" && title == $nome][0]{_id}`, { nome });
  return res?._id;
}

async function getCategoryId(nome: string) {
  const res = await editorClient.fetch<{ _id: string } | null>(`*[_type == "category" && title == $nome][0]{_id}`, { nome });
  return res?._id;
}

function isValidDate(date: string) {
  // Checks if date is in ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
  // and if it represents a valid date
  if (!date) return false;
  const parsed = Date.parse(date);
  return !isNaN(parsed);
}


