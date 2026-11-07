// ===============================================================
//  QUI AGGIUNGI I TUOI SUONI
//  1. Metti il file audio nella cartella "suoni"  (mp3 o m4a)
//  2. Metti l'immagine nella cartella "immagini"  (jpg, png, svg...)
//  3. Aggiungi una riga qui sotto, copiando quelle esistenti
// ===============================================================

const TITOLO_APP = "Soundboard Bang";

// effetto = animazione della carta (elenco in effetti.js)
// NB: le carte con demo-1/2/3 hanno ancora un suono di prova.
const SUONI = [
  { nome: "BANG!",      immagine: "immagini/bang.jpg",      audio: "suoni/bang.mp3", effetto: "spara" },
  { nome: "Mancato!",   immagine: "immagini/mancato.jpg",   audio: "suoni/demo-2.mp3", effetto: "schiva" },
  { nome: "Birra",      immagine: "immagini/birra.jpg",     audio: "suoni/birra.mp3", effetto: "bolle" },
  { nome: "Panico!",    immagine: "immagini/panico.jpg",    audio: "suoni/demo-1.mp3", effetto: "panico" },
  { nome: "Cat Balou",  immagine: "immagini/cat-balou.jpg", audio: "suoni/demo-2.mp3", effetto: "gira" },
  { nome: "Gatling",    immagine: "immagini/gatling.jpg",   audio: "suoni/gatling.mp3", effetto: "mitraglia" },
  { nome: "Diligenza",  immagine: "immagini/diligenza.jpg", audio: "suoni/diligenza.mp3", effetto: "schizzo" },
  { nome: "Duello",     immagine: "immagini/duello.jpg",    audio: "suoni/demo-2.mp3", effetto: "duello" },
  { nome: "Emporio",    immagine: "immagini/emporio.jpg",   audio: "suoni/demo-3.mp3", effetto: "schizzo" },
  { nome: "Indiani!",   immagine: "immagini/indiani.jpg",   audio: "suoni/demo-1.mp3", effetto: "frecce" },
  { nome: "Prigione",   immagine: "immagini/prigione.jpg",  audio: "suoni/prigione.mp3", effetto: "manette" },
  { nome: "Dinamite",   immagine: "immagini/dinamite.jpg",  audio: "suoni/dinamite.mp3", effetto: "esplosione" },
  { nome: "Barile",     immagine: "immagini/barile.jpg",    audio: "suoni/barile.mp3", effetto: "rotola" },
];

// Suono del pulsante grande "Spara allo sceriffo"
const SUONO_SCERIFFO = "suoni/sceriffo.mp3";

// Pulsante "Peppe Brescia"
const SUONO_PEPPE = "suoni/peppe.mp3";
const IMMAGINE_PEPPE = "immagini/peppe.jpg";

// Ogni volta che aggiungi o cambi suoni, aumenta questo numero
// così i telefoni degli amici scaricano la versione nuova.
const VERSIONE = 16;
