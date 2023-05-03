const provinciaElement = document.getElementById("provincia");
const restaurantFormElement = document.getElementById('restaurant-form');

async function main() {
	// Ottieni la lista di comuni italiani
	let response = await fetch("api/province");
	if (!response.ok) {
		console.error("Errore durante il caricamento delle province");
		return;
	}

	province = await response.json();
	province.forEach(provincia => {
		let option = document.createElement('option');
		option.value = provincia.sigla;
		option.text = `${provincia.nome} (${provincia.sigla})`;
		provinciaElement.appendChild(option);
	});

	// Aggiunge un listener di evento al form
	restaurantFormElement.addEventListener('submit', async event => {
		event.preventDefault();

		// Ottiene i dati dal form
		let nome = document.getElementById('nome').value;
		let provincia = document.getElementById('provincia').value;
		let indirizzo = document.getElementById('indirizzo').value;
		let anno_apertura = document.getElementById('anno_apertura').value;
		let specialita = document.getElementById('specialita').value;

		// Crea un oggetto con i dati del ristorante
		let ristorante = {
			nome,
			provincia,
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
