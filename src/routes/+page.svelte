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
		gap: 40px;
		z-index: 2;
	}
	nav a {
		text-decoration: none;
		color: white;
		font-size: 1.2rem;
		background-color: #05143e;
		padding: 30px 40px;
		border-radius: 10px;
		border: 1px solid white;
		box-shadow: 0px 30px 20px rgba(0, 0, 0, 0.515);
		font-weight: 800;
		letter-spacing: -0.9px;
		transition: all 0.3s ease-in-out;
	}
	nav a:hover {
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
			gap: 35px;
			padding: 40px 20px;
		}
	}
</style>
