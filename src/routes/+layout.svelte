<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@10..48,200..800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="site-shell">
	<header class="topbar">
		<a class="brand" href="/">Bit Philology</a>
		<nav>
			<a href="/">Home</a>
			<a href="/events">Events</a>
			<a href="/outputs">Outputs</a>
			<a href="/team">Team</a>
		</nav>
	</header>
	<div class="page-content">
		{@render children()}
	</div>
	<footer class="site-footer">
		<p>
			<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
		</p>
		<p>
			<a href="https://www.dh.unibe.ch/">Digital Humanities, University of Bern</a>
		</p>
		<div class="logo-space" aria-label="Space for partner logos">
			<a class="logo-slot logo-link" href="https://www.dh.unibe.ch/" aria-label="Digital Humanities, University of Bern">
				<img src="https://dhbern.github.io/logo.webp" alt="Digital Humanities, University of Bern logo" />
			</a>
			<div class="logo-slot">Logo space</div>
			<div class="logo-slot">Logo space</div>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		--burnt-orange: #ec5528;
		--forest-green: #0e6129;
		--paper-rose: #eedad3;
		--dark-gray-4: #4b4b50;
		--violet: #6e5a9f;
		--light-gray-3: #efeff1;
		--cotton-candy: #f6a9d0;
		--smoke-gray: #9f9ea1;

		margin: 0;
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 18px;
		line-height: 1.6;
		color: var(--dark-gray-4);
		background: #f7f7f8;
	}

	.site-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		box-sizing: border-box;
		max-width: 950px;
		margin: 0 auto;
		padding: 2.2rem 1.25rem 1.25rem;
	}

	.page-content {
		flex: 1;
	}

	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1.2rem;
		margin-bottom: 2rem;
		padding-bottom: 0.7rem;
		border-bottom: 1px solid rgba(159, 158, 161, 0.35);
	}

	.brand {
		color: var(--forest-green);
		text-decoration: none;
		font-weight: 800;
		font-size: 2rem;
		line-height: 1;
		letter-spacing: 0.01em;
	}

	.brand:hover {
		color: var(--burnt-orange);
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1.2rem;
		margin-bottom: 0;
	}

	nav a {
		padding: 0;
		color: var(--dark-gray-4);
		text-decoration: none;
		font-weight: 500;
		font-size: 1.05rem;
		letter-spacing: 0.005em;
		opacity: 0.9;
		transition:
			color 140ms ease,
			opacity 140ms ease;
	}

	nav a:hover {
		background: transparent;
		color: var(--burnt-orange);
		opacity: 1;
	}

	:global(main) {
		padding: 0;
	}

	:global(section) {
		padding: 0 0 1.4rem;
		margin: 0 0 1.4rem;
		background: transparent;
	}

	:global(section + section) {
		border-top: 1px solid rgba(110, 90, 159, 0.25);
		padding-top: 1.4rem;
	}

	:global(h2) {
		margin: 0 0 0.5rem;
		font-size: 1.65rem;
		color: var(--burnt-orange);
	}

	:global(p),
	:global(li),
	:global(small) {
		font-size: 1.05rem;
	}

	:global(a) {
		color: var(--violet);
		text-decoration-thickness: 1.5px;
		text-underline-offset: 3px;
	}

	:global(a:hover) {
		color: var(--burnt-orange);
	}

	:global(ul) {
		padding-left: 1.1rem;
	}

	:global(li) {
		margin-bottom: 0.7rem;
	}

	:global(small) {
		color: var(--smoke-gray);
	}

	.site-footer {
		margin-top: 2.4rem;
		padding-top: 1.1rem;
		border-top: 1px solid rgba(159, 158, 161, 0.35);
	}

	.site-footer p {
		margin: 0.2rem 0;
	}

	.logo-space {
		display: grid;
		grid-template-columns: repeat(3, minmax(110px, 1fr));
		gap: 0.65rem;
		/* margin-top: 0.9rem; */
	}

	.logo-slot {
		min-height: 58px;
		display: grid;
		place-items: center;
		font-size: 0.92rem;
		color: var(--smoke-gray);
	}

	.logo-link {
		padding: 0.45rem;
		text-decoration: none;
	}

	.logo-link img {
		max-height: 80px;
		max-width: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
	}

	@media (max-width: 700px) {
		.site-shell {
			padding: 1.4rem 0.9rem 1rem;
		}

		.topbar {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.6rem;
			margin-bottom: 1.4rem;
		}

		.brand {
			font-size: 1.7rem;
		}

		:global(section) {
			padding: 0 0 1.1rem;
		}

		nav {
			gap: 0.75rem;
			margin-bottom: 0;
		}

		.logo-space {
			grid-template-columns: 1fr;
		}
	}
</style>
