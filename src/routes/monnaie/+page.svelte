<script>
	import { onMount } from 'svelte';

	let countries = [];
	let currentCountry = null;
	let options = [];
	let counter = 0;
	let gamePart = 0;
	let showResult = false;
	let selected = null;

	// Charger les pays
	onMount(async () => {
	try {
		const endpoint = encodeURIComponent('https://restcountries.com/v3.1/all'); // ou autre URL
		const res = await fetch(`/.netlify/functions/getCountries?endpoint=${endpoint}`);
		if (!res.ok) throw new Error('Erreur lors du chargement des pays');
		countries = await res.json();
		startGame();
	} catch (error) {
		console.error('Erreur depuis la fonction Netlify :', error);
	}
});
	// Choisir un pays et générer les options
	function startGame() {
		showResult = false;
		selected = null;
		const randomIndex = Math.floor(Math.random() * countries.length);
		currentCountry = countries[randomIndex];
		generateOptions(currentCountry);
	}

	// Obtenir la monnaie principale
	function getCurrency(country) {
		const currencyCode = Object.keys(country.currencies || {})[0];
		if (!currencyCode) return 'Inconnu';
		return country.currencies[currencyCode]?.name || currencyCode;
	}

	// Obtenir le nom du pays en français
	function getCountryNameFR(country) {
		return country.translations?.fra?.common || country.name.common;
	}

	// Générer 2 fausses monnaies et 1 vraie
	function generateOptions(correctCountry) {
		const correctCurrency = getCurrency(correctCountry);
		const wrongOptions = [];

		while (wrongOptions.length < 2) {
			const random = countries[Math.floor(Math.random() * countries.length)];
			const wrongCurrency = getCurrency(random);
			if (wrongCurrency !== correctCurrency && !wrongOptions.includes(wrongCurrency)) {
				wrongOptions.push(wrongCurrency);
			}
		}

		options = [
			{ name: correctCurrency, isCorrect: true },
			...wrongOptions.map((name) => ({ name, isCorrect: false }))
		].sort(() => Math.random() - 0.5);
	}

	// Quand l’utilisateur clique
	function handleAnswer(option) {
		if (showResult) return;
		selected = option;
		if (option.isCorrect) counter++;
		showResult = true;
	}

	// Passer à la question suivante
	function nextQuestion() {
		gamePart++;
		if (gamePart < 10) {
			startGame();
		}
	}
</script>

<main>
	<div class="container">
		{#if gamePart < 10}
			{#if currentCountry}
				<div class="status">
					<p>Question {gamePart + 1}/10</p>
					<p>Bonnes réponses : {counter}</p>
				</div>
				<a href="/">Accueil</a>
				<div style="text-align: center;">
					<img
						class="flag"
						src={currentCountry.flags?.png}
						alt="Drapeau de {getCountryNameFR(currentCountry)}"
					/>
				</div>

				<h1>Quelle est la monnaie de {getCountryNameFR(currentCountry)} ?</h1>

				<div class="options">
					{#each options as option}
						<button
							class:selected={selected === option}
							class:correct={showResult && option.isCorrect}
							class:wrong={showResult && selected === option && !option.isCorrect}
							on:click={() => handleAnswer(option)}
						>
							{option.name}
						</button>
					{/each}
				</div>

				{#if showResult && gamePart < 10}
					<button class="next" on:click={nextQuestion} aria-label="Question suivante">
						Suivant
					</button>
				{/if}
			{/if}
		{:else}
			<h2>
				Bravo 🎉 Vous avez trouvé {counter} bonne{counter > 1 ? 's' : ''} réponse{counter > 1
					? 's'
					: ''} sur 10 !
			</h2>
			<button on:click={() => location.reload()}>Rejouer</button>
		{/if}
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-image: url('../../assets/visuA.png');
		font-family: 'DM Sans', sans-serif;
	}
	.container {
		background: rgba(255, 255, 255, 0.911);
		padding: 2rem;
		border-radius: 10px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
		min-width: 50%;
		height: 70%;
		box-shadow: 0px 30px 20px rgba(0, 0, 0, 0.329);
	}
	h1,
	h2 {
		text-align: center;
		margin-top: 1rem;
	}
	.flag {
		width: 220px;
		border-radius: 6px;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
		margin-bottom: 1rem;
	}
	.options {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-top: 2rem;
	}
	button {
		padding: 15px 20px;
		width: 230px;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		background: #ffffff;
		transition: background 0.3s;
		box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.28);
	}
	.selected {
		border: 2px solid #888;
	}
	.correct {
		background-color: #a8e6cf;
	}
	.wrong {
		background-color: #ff8b94;
	}
	.next {
		margin: 2rem auto;
		display: block;
		background-color: #333;
		color: white;
	}
	.status {
		text-align: center;
		font-weight: bold;
		color: #f9f9f9;
		margin-bottom: 1rem;
		background-color: rgb(102, 81, 225);
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0px 30px 20px rgba(0, 0, 0, 0.194);
		width: 50%;
		margin: 30px auto;
	}
</style>
