<main>
	<nav>
		<a href="/drapeaux">Drapeaux</a>
		<a href="/monnaie">Monnaie</a>
		<a href="/habitants">Habitants</a>
		<a href="/capitale">Capitale</a>
	</nav>
</main>

<style>
	main {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 100vh;
		background-image: url('../assets/homeImage.jpeg');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		z-index: 0;
	}

	nav {
		display: flex;
		gap: 20px;
		z-index: 2;
	}
	nav a {
		text-decoration: none;
		color: white;
		font-size: 1rem;
		background-color: #2a3659;
		padding: 12px 40px;
		border-radius: 10px;
		box-shadow: 0px 30px 20px rgba(0, 0, 0, 0.705);
		font-weight: 800;
		letter-spacing: -0.9px;
		transition: all 0.3s ease-in-out;
	}
	nav a:hover {
		background-color: #dbdbdb;

		color: #2a3659;
	}

	@media (max-width: 768px) {
		main {
			flex-direction: column;
			align-items: center;
		}
		nav {
			flex-direction: column;
			gap: 10px;
			padding: 30px 20px;
		}
	}
</style>
