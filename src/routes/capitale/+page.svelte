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

	function findUrl(regionUrl) {
	urlSelected = regionUrl;
	showGame = true;
	fetchData();
}

async function fetchData() {
	try {
		const encodedEndpoint = encodeURIComponent(urlSelected); // sécurise l'URL
		const res = await fetch(`/.netlify/functions/getCountries?endpoint=${encodedEndpoint}`);

		if (!res.ok) throw new Error('Erreur lors du fetch');
		flags = await res.json();
		startQuestion();
	} catch (err) {
		console.error('Erreur dans fetchData :', err);
	}
}

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

	function handleAnswer(option) {
		showResult = true;
		if (option.isCorrect) score++;
	}

	function nextQuestion() {
		questionNumber++;
		startQuestion();
	}

	function reload() {
		score = 0;
		questionNumber = 0;
		gameEnded = false;
		startQuestion();
	}
</script>

<div class="container">
	{#if !showGame}
		<h2>Choisis une région :</h2>
		{#each regions as region}
			<button on:click={() => findUrl(region.url)}>
				{region.name}
			</button>
		{/each}
	{:else if gameEnded}
		<h2>Fin du jeu !</h2>
		<p>Tu as trouvé {score} bonne(s) réponse(s) sur 10.</p>
		<button on:click={reload}>Rejouer</button>
	{:else}
		<h2>Quelle est la capitale de ce pays ?</h2>
		<a href="/">accueil</a>
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
					: `Bonne réponse : ${capitalOptions.find((o) => o.isCorrect).name}`}
			</p>
			{#if questionNumber < 9}
				<button on:click={nextQuestion}>Question suivante</button>
			{:else}
				<button on:click={nextQuestion}>Voir le score final</button>
			{/if}
		{/if}

		<p class="counter">Question : {questionNumber + 1}/10</p>
		<p class="counter">Bonne(s) réponse(s) : {score}</p>
	{/if}
</div>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
		text-align: center;
		background-image: url("../../assets/visuE.png");
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		height: 100vh;
		width: 100%;
	}
	.flag {
		width: 150px;
		margin-bottom: 20px;
	}
	.options button {
		display: block;
		margin: 10px auto;
		padding: 10px 20px;
		font-size: 1rem;
		cursor: pointer;
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
</style>
