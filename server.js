const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require("path");

const DEBUG = true;
const PORT = process.env.PORT || 3000;

const COMUNI_FILENAME = path.join(__dirname, "comuni.json");
const RECENSIONI_FILENAME = path.join(__dirname, "recensioni.json");
const RISTORANTI_FILENAME = path.join(__dirname, "ristoranti.json");

// Controlla che comuni.json esista
if (!fs.existsSync(COMUNI_FILENAME)) {
	console.error(`File ${COMUNI_FILENAME} non trovato`);
	process.exit(1);
}

// Crea i file JSON se non esistono
if (!fs.existsSync(RECENSIONI_FILENAME)) {
	fs.writeFileSync(RECENSIONI_FILENAME, "[]");
}

if (!fs.existsSync(RISTORANTI_FILENAME)) {
	fs.writeFileSync(RISTORANTI_FILENAME, "[]");
}

// Crea l'app Express
let app = express();

// Attiva CORS
app.use(cors({
	origin: '*'
}));

// Attiva il middleware per il parsing del body delle richieste
app.use(express.json());

// Specifica la cartella contenente i file statici
app.use(express.static(path.join(__dirname, 'public')));

app.get("/api/comuni", async (req, res) => {
	let comuni = JSON.parse(fs.readFileSync(COMUNI_FILENAME));
	res.json(comuni);
});

app.get("/api/ristoranti", async (req, res) => {
	let ristoranti = JSON.parse(fs.readFileSync(RISTORANTI_FILENAME));
	res.json(ristoranti);
});

app.post("/api/ristoranti", async (req, res) => {
	// Valida i dati
	if (
		// Dati definiti
		!req.body.nome || !req.body.comune || !req.body.indirizzo || !req.body.anno_apertura || !req.body.specialita
		// Comune valido
		|| !JSON.parse(fs.readFileSync(COMUNI_FILENAME)).includes(req.body.comune)
		// Anno di apertura valido
		|| isNaN(req.body.anno_apertura)
	) {
		res.status(400).send("Dati non validi");
		return;
	}

	let ristoranti = JSON.parse(await fs.promises.readFile(RISTORANTI_FILENAME));
	let ristorante = {
		"id": (ristoranti.length + 1),
		"nome": req.body.nome,
		"comune": req.body.comune,
		"indirizzo": req.body.indirizzo,
		"anno_apertura": req.body.anno_apertura,
		"specialita": req.body.specialita,
	}

	ristoranti.push(ristorante);

	// Scrivi su file JSON i dati
	await fs.promises.writeFile(RISTORANTI_FILENAME, JSON.stringify(ristoranti));

	res.json(ristorante);
});

app.get("/api/ristoranti/:ristorante_id", async (req, res) => {
	let ristoranti = JSON.parse(await fs.promises.readFile(RISTORANTI_FILENAME));

	let ristorante = ristoranti.find(r => r.id == req.params.ristorante_id);
	if (!ristorante) {
		res.status(404).send("Ristorante non trovato");
		return;
	}

	res.json(ristorante);
});

app.delete("/api/ristoranti/:ristorante_id", async (req, res) => {
	let ristoranti = JSON.parse(await fs.promises.readFile(RISTORANTI_FILENAME));

	let ristorante = ristoranti.find(r => r.id == req.params.ristorante_id);
	if (!ristorante) {
		res.status(404).send("Ristorante non trovato");
		return;
	}

	let recensioni = JSON.parse(await fs.promises.readFile(RECENSIONI_FILENAME));

	// Rimuovi le recensioni collegate al ristorante
	recensioni = recensioni.filter(r => r.ristorante_id != req.params.ristorante_id);

	// Scrivi su file JSON i dati
	await fs.promises.writeFile(RECENSIONI_FILENAME, JSON.stringify(recensioni));

	// Rimuovi il ristorante
	ristoranti = ristoranti.filter(r => r.id != req.params.ristorante_id);

	// Scrivi su file JSON i dati
	await fs.promises.writeFile(RISTORANTI_FILENAME, JSON.stringify(ristoranti));

	res.json(ristorante);
});

app.get("/api/ristoranti/:ristorante_id/recensioni", async (req, res) => {
	let recensioni = JSON.parse(await fs.promises.readFile(RECENSIONI_FILENAME));

	let recensioniRistorante = recensioni.filter(r => r.ristorante_id == req.params.ristorante_id);

	res.json(recensioniRistorante);
});

app.post("/api/ristoranti/:ristorante_id/recensioni", async (req, res) => {
	let recensioni = JSON.parse(await fs.promises.readFile(RECENSIONI_FILENAME));
	let ristoranti = JSON.parse(await fs.promises.readFile(RISTORANTI_FILENAME));

	let ristorante = ristoranti.find(r => r.id == req.params.ristorante_id);
	if (!ristorante) {
		res.status(404).send("Ristorante non trovato");
		return;
	}

	// Valida i dati
	if (
		// Dati definiti
		!req.body.stelle || !req.body.commento
		// Stelle valide
		|| isNaN(req.body.stelle) || req.body.stelle < 1 || req.body.stelle > 5
	) {
		res.status(400).send("Dati non validi");
		return;
	}

	let recensione = {
		"id": recensioni.length + 1,
		"ristorante_id": req.params.ristorante_id,
		// Crea una data ora
		"data": Math.round(new Date().getTime() / 1000),
		"stelle": req.body.stelle,
		"commento": req.body.commento,
	};

	recensioni.push(recensione);

	// Scrivi su file JSON i dati
	await fs.promises.writeFile(RECENSIONI_FILENAME, JSON.stringify(recensioni));

	res.json(recensione);
});

app.get("/api/ristoranti/:ristorante_id/recensioni/:recensione_id", async (req, res) => {
	let recensioni = JSON.parse(await fs.promises.readFile(RECENSIONI_FILENAME));
	let recensione = recensioni.find(r => r.id == req.params.recensione_id);

	if (!recensione) {
		res.status(404).send("Recensione non trovata");
		return;
	}

	res.json(recensione);
});

app.delete("/api/ristoranti/:ristorante_id/recensioni/:recensione_id", async (req, res) => {
	let recensioni = JSON.parse(await fs.promises.readFile(RECENSIONI_FILENAME));

	let recensione = recensioni.find(r => r.id == req.params.recensione_id);
	if (!recensione) {
		res.status(404).send("Recensione non trovata");
		return;
	}

	// Rimuovi la recensione
	recensioni = recensioni.filter(r => r.id != req.params.recensione_id);

	// Scrivi su file JSON i dati
	await fs.promises.writeFile(RECENSIONI_FILENAME, JSON.stringify(recensioni));
});

// Avvia il server
app.listen(PORT, function () {
	console.log("http://localhost:" + PORT + "/");
});
