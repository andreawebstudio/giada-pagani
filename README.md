# Sito one-page — Dott.ssa Giada Pagani

File: `index.html`, `styles.css`, `script.js`, `privacy-policy.html`, `cookie-policy.html`, cartella `images/`.
Sito statico, senza librerie né build: si pubblica così com'è (es. Vercel, preset "Other").

## Immagini

| File / sorgente | Uso |
|---|---|
| `images/giada-hero.png` | HERO — mani che si stringono (B/N), con velo bianco |
| `images/giada-foto.png` | Ritratto rotondo, solo sezione CHI SONO |
| Unsplash `photo-1765447041709-9f1efbc81606` | Servizi · Counseling individuale (due poltrone alla luce) |
| Unsplash `photo-1550622485-860e9d423364` | Servizi · Scrittura, fotografia e narrazione (diario, foto, macchina fotografica) |
| Unsplash `photo-1501504905252-473c47e087f8` | Servizi · Consulenza di comunicazione (scrivania con laptop e quaderno) |
| Unsplash `photo-1620326079720-500ba364af6a` | Servizi · Formazione (mano che scrive tra note adesive) |

Le foto dei servizi sono caricate da `images.unsplash.com` (licenza Unsplash, uso gratuito anche commerciale, senza volti).
Per ospitarle sul proprio dominio basta scaricarle in `images/` e aggiornare gli `src`/`srcset` in `index.html`.

La foto HERO attuale è larga 794 px: se disponibile, sostituirla con una versione di almeno 2000 px con lo stesso nome file.

## Dove ricevo

Il box indirizzo mostra solo "Bologna": inserire via e numero civico dello studio in `index.html` (commento nella sezione `#dove-ricevo`).

## Modulo di contatto

Nessun invio simulato. Senza backend il pulsante apre il programma di posta con l'email già compilata per giada.pagani87@gmail.com.
Per collegare un servizio di invio (es. Formspree o un endpoint proprio) impostare l'URL in `data-endpoint` del `<form id="contact-form">`: i dati vengono inviati in POST JSON e la conferma appare solo con risposta positiva del server. Aggiornare poi la Privacy Policy.

## Prima della pubblicazione definitiva

- Sostituire `https://www.esempio-dominio.it/` (canonical e Open Graph) con il dominio reale.
- Completare Privacy e Cookie Policy (campi tra parentesi quadre) e verificare gli obblighi informativi della professione.
- Consigliato: ospitare i font Bodoni Moda e Montserrat sul proprio server (eliminando il collegamento a Google Fonts).
