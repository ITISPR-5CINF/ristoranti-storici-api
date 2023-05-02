const infoRistoranteElement = document.getElementById("info-ristorante");
const recensioneFormElement = document.getElementById("recensione-form");
const recensioniElement = document.getElementById("recensioni");

const params = new URLSearchParams(window.location.search);

async function aggiornaRecensioni() {
	if (!params.has("id")) {
		console.log("Errore: ID del ristorante non specificato");
		recensioniElement.innerHTML = "<p>Errore durante il caricamento delle recensioni</p>";
		return;
	}

	let ristoranteId = params.get("id");

	response = await fetch(`api/ristoranti/${ristoranteId}/recensioni`);
	if (!response.ok) {
		console.error(`Errore durante il caricamento delle recensioni del ristorante ${ristoranteId}: ${response.status}`);
		recensioniElement.innerHTML = "<p>Errore durante il caricamento delle recensioni</p>";
		return;
	}

	let recensioni = await response.json();

	if (recensioni.length === 0) {
		recensioniElement.innerHTML = "<p>Nessuna recensione trovata</p>";
		return;
	}

	recensioniElement.innerHTML = "";

	recensioni.sort((a,b) => b.data - a.data);

	recensioni.forEach(recensione => {
		recensioniElement.innerHTML += `
			<div class="recensione">
				<div class="recensione-info">
					<p class="recensione-stelle">Stelle: ${recensione.stelle}</p>
					<p class="recensione-data">Data: ${new Date(recensione.data * 1000).toLocaleDateString()}</p>
				</div>
				<p class="recensione-testo">${recensione.commento}</p>
			</div>
		`
	});
}

async function main() {
	if (!params.has("id")) {
		console.log("Errore: ID del ristorante non specificato");
		infoRistoranteElement.innerHTML = "<p>Errore: Ristorante non trovato</p>";
		return;
	}

	let ristoranteId = params.get("id");

	let response = await fetch(`api/ristoranti/${ristoranteId}`);
	if (!response.ok) {
		console.error(`Errore durante il caricamento del ristorante ${ristoranteId}: ${response.status}`);
		infoRistoranteElement.innerHTML = "<p>Errore: Ristorante non trovato</p>";
		return;
	}

	let ristorante = await response.json();

	infoRistoranteElement.innerHTML = `
		<h1 class="ristorante-nome">${ristorante.nome}</h1>
		<p class="ristorante-comune">Comune: ${ristorante.comune}</p>
		<p class="ristorante-indirizzo">Indirizzo: ${ristorante.indirizzo}</p>
		<p class="ristorante-anno-apertura">Anno di apertura: ${ristorante.anno_apertura}</p>
		<p class="ristorante-specialita">Specialità: ${ristorante.specialita}</p>
	`

	recensioneFormElement.addEventListener("submit", async event => {
		event.preventDefault();

		let stelle = document.getElementById("stelle").value;
		let commento = document.getElementById("commento").value;

		let recensione = {
			"stelle": stelle,
			"commento": commento,
		}

		response = await fetch(`api/ristoranti/${ristoranteId}/recensioni`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(recensione),
		});

		if (!response.ok) {
			console.error(`Errore durante l'inserimento della recensione: ${response.status}`);
			return;
		}

		await aggiornaRecensioni();
	});

	await aggiornaRecensioni();
}

main();
