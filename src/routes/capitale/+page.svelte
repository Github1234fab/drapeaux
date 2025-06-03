<script>
	import { onMount } from 'svelte';

	let urls = [
		'https://restcountries.com/v3.1/region/europe',
		'https://restcountries.com/v3.1/region/asia',
		'https://restcountries.com/v3.1/region/america',
		'https://restcountries.com/v3.1/region/africa',
		'https://restcountries.com/v3.1/region/oceania',
		'https://restcountries.com/v3.1/all'
	];

	let regions = [
		{ name: 'Europe', url: 'https://restcountries.com/v3.1/region/europe' },
		{ name: 'Asie', url: 'https://restcountries.com/v3.1/region/asia' },
		{ name: 'Amérique', url: 'https://restcountries.com/v3.1/region/america' },
		{ name: 'Afrique', url: 'https://restcountries.com/v3.1/region/africa' },
		{ name: 'Océanie', url: 'https://restcountries.com/v3.1/region/oceania' },
		{ name: 'Monde entier', url: 'https://restcountries.com/v3.1/all' }
	];

	let flags = [];
	let country = {};
	let capitalOptions = [];
	let showResult = false;
	let score = 0;
	let questionNumber = 0;
	let gameEnded = false;
	let urlSelected = '';
	let showGame = false;

	// Fonction pour sélectionner une région et afficher le jeu
	function findUrl(regionUrl) {
		urlSelected = regionUrl;
		showGame = true;
		fetchData();
	}

	// Fonction pour faire la requête via le proxy
	async function fetchData() {
		try {
			const encodedEndpoint = encodeURIComponent(urlSelected); // Sécurisation de l'URL

			// On fait appel au proxy
			const res = await fetch(`/api/proxy?endpoint=${encodedEndpoint}`);
			if (!res.ok) throw new Error('Erreur lors du fetch');
			flags = await res.json();
			startQuestion();
		} catch (err) {
			console.error('Erreur dans fetchData :', err);
		}
	}

	// Fonction pour démarrer la question
	function startQuestion() {
		if (questionNumber >= 10) {
			gameEnded = true;
			return;
		}
		showResult = false;

		const randomIndex = Math.floor(Math.random() * flags.length);
		country = flags[randomIndex];

		const correctCapital = country.capital?.[0] || 'Capitale inconnue';

		const random1 = flags[Math.floor(Math.random() * flags.length)].capital?.[0] || 'Inconnue';
		let random2;
		do {
			random2 = flags[Math.floor(Math.random() * flags.length)].capital?.[0] || 'Inconnue';
		} while (random2 === random1 || random2 === correctCapital);

		capitalOptions = [
			{ name: correctCapital, isCorrect: true },
			{ name: random1, isCorrect: false },
			{ name: random2, isCorrect: false }
		].sort(() => Math.random() - 0.5);
	}

	// Fonction pour gérer la réponse de l'utilisateur
	function handleAnswer(option) {
		showResult = true;
		if (option.isCorrect) score++;
	}

	// Passer à la question suivante
	function nextQuestion() {
		questionNumber++;
		startQuestion();
	}

	// Recharger le jeu
	function reload() {
		score = 0;
		questionNumber = 0;
		gameEnded = false;
		startQuestion();
	}
</script>

<div class="container">
	{#if !showGame}
		<div class="wrapper">
			{#each regions as region}
				<button on:click={() => findUrl(region.url)}>
					{region.name}
				</button>
			{/each}
		</div>
	{:else if gameEnded}

		<h2>Fin du jeu !</h2>
		<p>Tu as trouvé {score} bonne(s) réponse(s) sur 10.</p>
		<button on:click={reload}>Rejouer</button>
	
	{:else}
		<div class="wrapper__game">
			<img class="flag" src={country.flags?.png} alt="Drapeau" />
			<p class="country-name">{country.translations?.fra?.common || 'Nom du pays inconnu'}</p>

			<div class="options">
				{#each capitalOptions as opt}
					<button on:click={() => handleAnswer(opt)} disabled={showResult}>
						{opt.name}
					</button>
				{/each}
			</div>
			{#if showResult}
				<p class="counter">
					{capitalOptions.find((o) => o.isCorrect)?.name === 'Capitale inconnue'
						? 'La capitale est inconnue 😕'
						: `C'est : ${capitalOptions.find((o) => o.isCorrect).name}`}
				</p>
				{#if questionNumber < 9}
					<button class="btn-next" on:click={nextQuestion}>Question suivante</button>
				{:else}
					<button class="btn-next" on:click={nextQuestion}>Voir le score final</button>
				{/if}
			{/if}

			<p class="counter">Question : {questionNumber + 1}/10</p>
			<p class="counter">Total : {score}/10</p>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
		text-align: center;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		height: 100vh;
		width: 100%;
		background-image: url('../../assets/visuB.png');
	}
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		padding: 30px;
		margin: 0px auto;
		text-align: center;
	}
	.wrapper__game {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		padding: 30px;
		text-align: center;
		background-color: white;
		width: 90%;
		margin: 0px auto;
		border-radius: 15px;
		
	}
	.wrapper button {
		background-color: white;
		color: rgb(11, 9, 43);
		padding: 12px 15px;
		border-radius: 10px;
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.169);
		font-weight: 700;
		letter-spacing: -0.9px;
		cursor: pointer;
		margin-top: 0px;
		border: 1px solid black;
		transition: 0.3s ease-in-out;
	}
	.wrapper button:hover {
		background-color: rgb(4, 4, 43);
		color: white;
	}

	.flag {
		width: 200px;
		margin-bottom: 0px;
		border-radius: 10px;
	}
	.options button {
		padding: 10px 20px;
		font-size: 1rem;
		cursor: pointer;
		width: 70%;
		border-radius: 10px;
		background-color: rgb(4, 4, 43);
		color: white;
		border: none;
		margin-top: 0.5rem;
		box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.2);
	}
	.counter {
		margin-top: 1rem;
		font-weight: bold;
	}
	.country-name {
		font-size: 1.2em;
		text-align: center;
		margin-top: 10px;
	}
	.btn-next {
		background-color: green;
		color: white;
		padding: 10px 20px;
		border-radius: 10px;
		border: none;
		cursor: pointer;
		font-size: 1.2rem;
		margin-top: 1rem;
		box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.2);
	}
</style>
