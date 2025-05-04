<script>
	import { onMount } from 'svelte';

	let flags = [];
	let country = '';
	let countryFlag = '';
	let correctDemonym = '';
	let options = [];
	let showResult = false;
	let gamePart = 0;
	let score = 0;

	// Chargement des données à l'initialisation
	onMount(async () => {
		try {
			// Encodage de l'URL pour sécuriser la requête
			const endpoint = 'https://restcountries.com/v3.1/all';
			const encodedEndpoint = encodeURIComponent(endpoint);

			// On fait appel au proxy
			const response = await fetch(`/api/proxy?endpoint=${encodedEndpoint}`);
			if (!response.ok) throw new Error('Erreur lors du fetch');
			flags = await response.json();
			startNewRound();
		} catch (error) {
			console.error('Erreur dans onMount :', error);
		}
	});

	// Démarre une nouvelle question
	function startNewRound() {
		showResult = false;

		const randomIndex = Math.floor(Math.random() * flags.length);
		const selected = flags[randomIndex];

		country = selected.translations?.fra?.common || selected.name.common;
		countryFlag = selected.flags?.png;

		const demonym = selected.demonyms?.fra?.m || selected.demonyms?.eng?.m || 'Non disponible';

		correctDemonym = demonym;

		// Génère 2 autres gentilés au hasard
		let otherOptions = [];
		while (otherOptions.length < 2) {
			const randomOther = flags[Math.floor(Math.random() * flags.length)];
			const otherDemonym = randomOther.demonyms?.fra?.m || randomOther.demonyms?.eng?.m || null;

			if (otherDemonym && otherDemonym !== correctDemonym && !otherOptions.includes(otherDemonym)) {
				otherOptions.push(otherDemonym);
			}
		}

		// Mélange les options
		options = [
			{ name: correctDemonym, isCorrect: true },
			...otherOptions.map((opt) => ({ name: opt, isCorrect: false }))
		].sort(() => Math.random() - 0.5);
	}

	// Gère la réponse de l'utilisateur
	function reponse(option) {
		if (option.isCorrect) score++;
		gamePart++;
		showResult = true;
	}

	// Relance une nouvelle partie
	function restartGame() {
		if (gamePart < 10) startNewRound();
	}
</script>

<main>
	{#if gamePart < 10}
		<div class="container">
			<h2>Comment appelle-t-on les habitants de :</h2>
			<h1>{country}</h1>
			<img class="flag" src={countryFlag} alt="Drapeau de {country}" />

			<div class="options">
				{#each options as opt}
					<button on:click={() => reponse(opt)}>{opt.name}</button>
				{/each}
			</div>

			{#if showResult}
				<p>
					{options.find((o) => o.isCorrect).name === correctDemonym
						? 'Bonne réponse !'
						: `Mauvaise réponse. Réponse attendue : ${correctDemonym}`}
				</p>
				<button class="next" on:click={restartGame} aria-label="Question suivante">
					Suivant
				</button>
			{/if}

			<p class="score">
				Question : {gamePart} / 10<br />
				Bonnes réponses : {score}
			</p>
		</div>
	{:else}
		<div class="score">
			<h2>Quiz terminé !</h2>
			<p>Score final : {score} / 10</p>
			<button on:click={() => location.reload()}>Rejouer</button>
			<a href="/">Retour au menu principal</a>
		</div>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		background-image: url('../../assets/visuB.png');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 30px;
		margin: 10px auto;
		text-align: center;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		letter-spacing: -1px;
		height: 100%;
		width: 95%;
	}
	h2 {
		font-size: 1rem;
		color: #2a3659;
	}
	.flag {
		width: 220px;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		margin-bottom: 1rem;
	}
	.options button {
		margin: 0.5rem;
		padding: 0.7rem 1.2rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		background: #ffffff;
		font-weight: bold;
		box-shadow: 0px 20px 10px rgba(0, 0, 0, 0.1);
	}
	.options button:hover {
		background-color: #ddd;
		color: white;
	}
	.next {
		margin-top: 1rem;
		background-color: black;
		padding: 20px;
		color: white;
		font-weight: bold;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: 0.3s ease-in-out;
		box-shadow: 0px 20px 10px rgba(0, 0, 0, 0.246);
	}
	.next:hover {
		padding: 25px;
	}
	.score {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		padding: 30px;
		margin: 0 auto;
		color: white;
		text-align: center;
		background-color: rgb(26, 150, 26);
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		font-weight: 700;
	}
	.score button {
		background-color: black;
		padding: 20px;
		color: white;
		font-weight: bold;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: 0.3s ease-in-out;
		box-shadow: 0px 20px 10px rgba(0, 0, 0, 0.246);
	}
</style>
