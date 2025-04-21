

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
	}
	nav {
		display: flex;
		gap: 30px;
	}
	nav a {
		text-decoration: none;
		color: rgb(17, 17, 17);
		font-size: 1rem;
		background-color: #f5f5f5;
		padding: 10px 50px;
		border-radius: 10px;
		border: none;
		box-shadow: 10px 30px 20px rgba(0, 0, 0, 0.757);
		font-weight: 800;
		letter-spacing: -0.9px;
		transition: all 0.3s ease-in-out;
	}
	nav a:hover {
		background-color: #1f1e1e;
		color: rgb(242, 241, 241);
		padding: 20px 50px;
	}

	@media (max-width: 768px) {
		main {
			flex-direction: column;
			align-items: center;
		}
		nav {
			flex-direction: column;
			gap: 5px;
			padding: 40px 20px;
		}
	}
</style>
