<script>
	// Importation de la fonction onMount (pas utilisée ici pour l'instant, mais peut servir à lancer une fonction au chargement)
	import { onMount } from 'svelte';

	// Tableau contenant les URLs pour récupérer les pays selon une région ou tous les pays
	let urls = [
		'https://restcountries.com/v3.1/region/europe',
		'https://restcountries.com/v3.1/region/asia',
		'https://restcountries.com/v3.1/region/america',
		'https://restcountries.com/v3.1/region/africa',
		'https://restcountries.com/v3.1/region/Oceania',
		'https://restcountries.com/v3.1/all'
	];

	// Données et états utilisés dans le jeu
	let flags = []; // Liste des pays (résultat de l'API)
	let countryName = ''; // Nom du pays à deviner (bonne réponse)
	let countryFlag = ''; // URL de l’image du drapeau à afficher
	let dataNameRandomOne = ''; // Mauvaise réponse 1
	let dataNameRandomTwo = ''; // Mauvaise réponse 2
	let counter = 0; // Nombre de bonnes réponses
	let gamePart = 0; // Numéro de la question (ou du tour)
	let urlSelected = ''; // URL de la région sélectionnée par l'utilisateur
	let showGame = false; // Booléen pour afficher ou non le jeu
	let isFinished = false;
	let selectedOption = null;

	// Fonction principale pour récupérer les données depuis l’API
	async function fetchData() {
		try {
			const response = await fetch(urlSelected); // Requête vers l'API avec l'URL sélectionnée
			flags = await response.json(); // Récupération des données
			oneFlag(); // Choix du pays à deviner
			randomNameOne(); // Génère un nom incorrect
			randomNameTwo(); // Génère un autre nom incorrect différent du premier
			shuffle(); // Mélange les réponses
		} catch (err) {
			console.error(err); // Gestion d’erreur
		}
	}

	// Fonction appelée quand l'utilisateur sélectionne une région (via un bouton par exemple)
	function findUrl(index) {
		urlSelected = urls[index]; // Sélection de l’URL en fonction de l'index du tableau
		showGame = true; // On passe à l’écran du jeu
		fetchData(); // On charge les données de cette région
	}

	// Sélectionne un pays au hasard pour le deviner
	function oneFlag() {
		const randomIndex = Math.floor(Math.random() * flags.length);
		const selected = flags[randomIndex];
		countryName = selected.translations.fra.common; // Nom du pays (en français)
		countryFlag = selected.flags.png; // URL de son drapeau
	}

	// Génère un faux nom de pays au hasard
	function randomNameOne() {
		const randomIndex = Math.floor(Math.random() * flags.length);
		dataNameRandomOne = flags[randomIndex].translations.fra.common;
	}

	// Génère un deuxième faux nom de pays, différent du premier
	function randomNameTwo() {
		let name;
		do {
			const randomIndex = Math.floor(Math.random() * flags.length);
			name = flags[randomIndex].translations.fra.common;
		} while (name === dataNameRandomOne); // Tant que c’est le même que le précédent, on recommence
		dataNameRandomTwo = name;
	}

	// Mélange les 3 options (2 fausses + 1 vraie) et les met dans le tableau options
	function shuffle() {
		options = [
			{ name: dataNameRandomOne, isCorrect: false },
			{ name: dataNameRandomTwo, isCorrect: false },
			{ name: countryName, isCorrect: true }
		];
		// Mélange aléatoire des options
		options = options.sort(() => Math.random() - 0.5);
	}

	let options = []; // Tableau des propositions (3 noms de pays)
	let showResult = false; // Affiche ou non le résultat (bonne/mauvaise réponse)

	// Fonction appelée quand l'utilisateur clique sur une option
	function reponse(option) {
		if (option.isCorrect) counter++;
		gamePart++;

		if (gamePart >= 10) {
			isFinished = true;
		} else {
			showResult = true;
		}
	}
	function rejouer() {
		gamePart = 0;
		counter = 0;
		isFinished = false;
		showResult = false;
		oneFlag();
		randomNameOne();
		randomNameTwo();
		shuffle();
		location.reload();
	}

	// Relance une question (nouveau pays et nouvelles options)
	function restartGame() {
		showResult = false;
		oneFlag();
		randomNameOne();
		randomNameTwo();
		shuffle();
	}

	// Recharge complètement la page (utile pour "Reset Game")
	// function reload() {
	// 	location.reload();
	// }
</script>

<main>
	<div class="container_game">
		<div class="themes">
			{#each ['Europe', 'Asie', 'Amérique', 'Afrique', 'Océanie', 'Monde'] as continent, i}
				<span class="continent"
					>{continent} <input type="radio" name="continent" on:click={() => findUrl(i)} /></span
				>
			{/each}
		</div>

		{#if showGame}
			<div class="container_Gaming">
				<div class="container_div container_div_visible">
					<div class="container_flagAndCounter">
						<div class="nbr_of_shot">
							<h3 class="counter_title">Coups</h3>
							<h3 class="counter">{gamePart}/10</h3>
						</div>
						<img src={countryFlag} alt="Drapeau" class="countryFlag" />
						<div class="points">
							<h3 class="counter_title">Points</h3>
							<h3 class="counter">{counter}/10</h3>
						</div>
					</div>
					<a href="/">Accueil</a>

					<div class="container_countries_names">
						{#each options as opt}
							<!-- <button class="countries_names" on:click={() => reponse(opt)}>{opt.name}</button> -->
							<button
								class="countries_names {showResult
									? opt.isCorrect
										? 'correct'
										: opt === selectedOption
											? 'incorrect'
											: 'neutral'
									: ''}"
								on:click={() => !showResult && reponse(opt)}
							>
								{opt.name}
							</button>
						{/each}
					</div>

					{#if gamePart < 10 && showResult}
						<button aria-label="Question suivante" class="next" on:click={restartGame}>
							<i class="fa-solid fa-arrow-right fa-2xl arrow"></i>
						</button>
					{/if}
					{#if isFinished}
						<div class="end-game">
							<p> Partie terminée !</p>
							<p>Votre score : {counter} / 10</p>
							<button on:click={rejouer}>Rejouer</button>
							<a class="return" href="/">Retour au menu principal</a>
						</div>
					{/if}

				
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	main {
		background-image: url('../../assets/visuD.png');
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		height: 100vh;
	}
	.container_game {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		
	}
	.container_Gaming {
		display: flex;
		justify-content: center;
		width: 60%;
		background-color: rgb(242, 242, 242);
		border-radius: 10px;
		margin-top: 20px;
	}
	.container_flagAndCounter {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 40px;
		background-color: white;
		padding: 40px;
		border-radius: 20px;
		box-shadow: 0px 30px 20px rgba(30, 30, 30, 0.408);
	}

	.counter_title {
		color: rgb(13, 13, 13);
		font-size: 1rem;
		font-weight: bold;
		padding: 20px;
		letter-spacing: -1px;
	}

	.container_countries_names {
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
		align-content: center;
		justify-content: center;
		width: 80%;
		height: 30%;
	}
	.countries_names {
		color: rgb(1, 1, 72);
		box-shadow: 1px 1px 7px 0px rgb(83, 82, 82);
		background-color: rgb(252, 252, 252);
		width: 70%;
		padding: 15px;
		font-size: 17px;
		border-radius: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0px 30px 20px rgba(30, 30, 30, 0.408);
		border: none;
		cursor: pointer;
		transition: 0.2s ease-in-out;
	}
	.countries_names:hover {
		padding: 20px;
	}
	.countries_names.correct {
		background-color: #4caf50; /* vert */
		color: white;
	}

	.countries_names.incorrect {
		background-color: #f44336; /* rouge */
		color: white;
	}

	.countries_names.neutral {
		background-color: #ddd;
		color: #333;
	}

	.container_div {
		visibility: hidden;
	}
	.container_div_visible {
		margin-top: 50px;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 600px;
		visibility: visible;
		width: 100%;
		gap: 20px;
	}
	.nbr_of_shot,
	.points {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: white;
	}

	.counter {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		color: rgb(18, 17, 17);
		border: solid 1px white;
		padding: 10px;
		border-radius: 10px;
		background-color: transparent;
		width: 100px;
		height: 100px;
		padding: 20px;
		box-shadow: 1px 1px 5px rgb(30, 30, 30);
	}

	.countryFlag {
		height: 200px;
		width: 300px;
		border: 2px solid rgb(221, 219, 219);
		border-radius: 10px;
	}

	/* .table_board {
		background-color: white;
		box-shadow: 2px -1px 5px black inset;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		border-radius: 7px;
		width: 100%;
		z-index: 1;
	} */

	.themes {
		margin-top: 100px;
		width: 90%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 30px;
		background-color: white;
		border-radius: 20px;
		box-shadow: 0px 30px 20px rgba(30, 30, 30, 0.408);
	}
	.continent {
		color: orangered;
		font-size: 13px;
		height: 50px;
		width: 100px;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center;
		align-content: center;
		letter-spacing: 0px;
		text-transform: uppercase;
		font-weight: 700;
		gap: 5px;
	}
	.next {
		background-color: #6744a8;
		color: white;
		font-size: 14px;
		border-radius: 10px;
		border: 2px solid rgb(234, 234, 234);
		transition: 0.4s ease-in-out;
		display: flex;
		align-items: center;
		align-content: center;
		justify-content: center;
		box-shadow: 0px 30px 20px rgba(30, 30, 30, 0.408);
		transition: 0.2s ease-in-out;
		padding: 20px 10px;
		
	}
	.next:hover{
		padding: 22px 12px;
	background-color: rgb(21, 21, 21);
	}

	.end-game {
		text-align: center;
		margin-top: 2rem;
		background-color: rgb(15, 156, 15);
		padding: 30px;
		border-radius: 10px;
	}

	.end-game p {
		font-size: 1rem;
		color: white;
		font-family: 'DM Sans', sans-serif;
		
	}

	.end-game button, .return {
		margin-top: 20px;
		margin: 1rem;
		padding: 20px 30px;
		font-size: 1rem;
		font-weight: bold;
		border-radius: 10px;
		border: none;
		background-color: #007bff;
		color: white;
		cursor: pointer;
		box-shadow: 0px 30px 20px rgba(30, 30, 30, 0.408);
		text-decoration: none;
	}
	.end-game button:hover, .return:hover{
		background-color: #0056b3;
	}
	/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

	@media screen and (max-width: 768px) {
		.container_game {
			margin-top: 10px;
		}
		.countries_names {
			font-size: 14px;
		}

		.counter {
			display: flex;
			align-items: left;
			justify-content: center;
			font-size: 14px;
			color: rgb(255, 255, 255);
			border: solid 1px white;
			border-radius: 10px;
			background-color: transparent;
			width: 70px;
			height: 70px;
			padding: 20px;
			box-shadow: 1px 1px 5px rgb(30, 30, 30);
		}
		.container_flagAndCounter {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			gap: 15px;
		}
/* 		
		.table_board {
			background-color: white;
			box-shadow:
				1px -1px 3px black inset,
				-1px 1px 3px black inset;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 20px;
			padding-bottom: 40px;
			border-radius: 7px;
			width: 90%;
			height: 30px;
			z-index: 1;
			margin-top: 10px;
		} */
		.continent {
			color: orangered;
			font-size: 10px;
			height: 30px;
			width: 100px;
			display: flex;
			flex-direction: column;
			align-items: center;
			align-content: center;
			font-family: poppins;
			letter-spacing: 0px;
			text-transform: uppercase;
			font-weight: bold;
			gap: -5px;
			margin-top: 0px;
		}
		.container_div_visible {
			margin-top: 70px;
			display: flex;
			flex-direction: column;
			align-items: center;
			visibility: visible;
			width: 100%;
			gap: 20px;
		}
	}

	/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

	@media screen and (min-width: 768px) {
		.container_countries_names {
			width: 400px;
		}
		
		/* .table_board {
			margin-top: 5px;
			box-shadow:
				2px -1px 5px black inset,
				-2px 1px 5px black inset;
			width: 90%;
		} */
	}
</style>
