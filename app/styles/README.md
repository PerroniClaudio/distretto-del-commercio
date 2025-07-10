# Bootstrap Italia Theme Customization

Questo progetto utilizza una struttura modulare per personalizzare i colori di Bootstrap Italia in modo efficace e mantenibile.

## Struttura dei file

```
app/
├── globals.scss                 # File principale con import e override critici
└── styles/
    ├── _variables.scss         # Variabili CSS personalizzate
    ├── _mixins.scss           # Mixins riutilizzabili
    ├── _utilities.scss        # Utilities Bootstrap (colori, link, alert)
    ├── _buttons.scss          # Personalizzazione bottoni
    ├── _forms.scss            # Componenti form (input, progress, badge)
    ├── _navigation.scss       # Componenti navigazione (navbar, breadcrumb, tab)
    ├── _components.scss       # Altri componenti Bootstrap
    ├── _bootstrap-italia.scss # Componenti specifici Bootstrap Italia
    └── _tooltips.scss         # Tooltip e popover
```

## Vantaggi del refactor

### 🎯 **Organizzazione modulare**

- Ogni tipo di componente ha il suo file specifico
- Facile trovare e modificare stili specifici
- Struttura logica e scalabile

### 🔧 **Riduzione delle ripetizioni**

- Uso di mixins per pattern comuni
- Variabili CSS per colori e loro varianti
- Eliminazione del codice duplicato

### 🚀 **Manutenibilità**

- Riduzione dell'uso di `!important` dove possibile
- Selettori più specifici e mirati
- Codice più pulito e leggibile

### 📱 **Performance**

- Eliminazione delle media queries ridondanti
- CSS più efficiente e compatto
- Caricamento ottimizzato

## Come utilizzare

### Modificare i colori principali

Modifica le variabili in `_variables.scss`:

```scss
:root {
  --bs-primary: #00cc22;
  --bs-secondary: #5c6f82;
  // ... altri colori
}
```

### Aggiungere nuovi stili

1. Identifica il tipo di componente
2. Modifica il file corrispondente nella cartella `styles/`
3. Usa i mixins esistenti quando possibile

### Personalizzare Bootstrap Italia

Gli override specifici per Bootstrap Italia sono in `_bootstrap-italia.scss`.

## File principali

- **globals.scss**: Import principale e override critici per colori hardcodati
- **\_variables.scss**: Tutte le variabili CSS con varianti automatiche
- **\_mixins.scss**: Mixins riutilizzabili per pattern comuni
- **\_bootstrap-italia.scss**: Override specifici per componenti Bootstrap Italia

## Note importanti

- I colori hardcodati (#06c) sono gestiti con override specifici
- Gli `!important` sono usati solo dove strettamente necessario
- La struttura supporta facilmente l'aggiunta di nuovi temi

## Sistema di moduli Sass

Il progetto utilizza il **nuovo sistema di moduli Sass** (`@use` e `@forward`) invece del deprecato `@import`.

### ⚠️ Regola importante: Ordine degli import

```scss
/* ✅ CORRETTO - @use PRIMA di @import */
@use "styles" as *;
@import "bootstrap-italia/dist/css/bootstrap-italia.min.css";

/* ❌ SBAGLIATO - @import prima di @use causa errore */
@import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
@use "styles" as *;
```

### Struttura dei moduli

```
app/styles/
├── _index.scss              # Indice che esporta tutti i moduli
├── _variables.scss          # Variabili CSS personalizzate
├── _mixins.scss            # Mixins riutilizzabili
└── ... (altri moduli)
```

### Come funziona

1. **`_index.scss`** - Utilizza `@forward` per esportare tutti i moduli
2. **`globals.scss`** - Importa tutto con `@use "styles" as *`
3. **Moduli individuali** - Utilizzano `@use "mixins" as *` per accedere ai mixins

### Vantaggi del nuovo sistema

- ✅ **Namespace isolati** - Evita conflitti di nomi
- ✅ **Performance migliori** - Caricamento più efficiente
- ✅ **Compatibilità futura** - `@import` è deprecato
- ✅ **Gestione dipendenze** - Controllo esplicito delle dipendenze
- ✅ **Errori di compilazione risolti** - Compatibilità con Sass moderno
