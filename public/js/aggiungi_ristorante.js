const comuneElement = document.getElementById("comune");
const restaurantFormElement = document.getElementById('restaurant-form');

async function main() {
	// Ottieni la lista di comuni italiani
	let response = await fetch("api/comuni");
	if (!response.ok) {
		console.error("Errore durante il caricamento dei comuni");
		return;
	}

	comuni = await response.json();
	comuni.forEach(comune => {
		let option = document.createElement('option');
		option.value = comune;
		option.text = comune;
		comuneElement.appendChild(option);
	});

	// Aggiunge un listener di evento al form
	restaurantFormElement.addEventListener('submit', async event => {
		event.preventDefault();

		// Ottiene i dati dal form
		let nome = document.getElementById('nome').value;
		let comune = document.getElementById('comune').value;
		let indirizzo = document.getElementById('indirizzo').value;
		let anno_apertura = document.getElementById('anno_apertura').value;
		let specialita = document.getElementById('specialita').value;

		// Crea un oggetto con i dati del ristorante
		let ristorante = {
			nome,
			comune,
			indirizzo,
			anno_apertura,
			specialita,
		};

		let response = await fetch("api/ristoranti", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(ristorante),
		})

		if (!response.ok) {
			console.error("Errore durante l'inserimento del ristorante");
			return;
		}

		// Ritorna a /
		window.location.href = "/";
	});
}

main();
