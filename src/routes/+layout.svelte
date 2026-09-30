<script lang="ts">
	import '../app.css';
	// Mona Sans: weight axis only. If the width axis is ever needed, switch to standard.css and standard-italic.css.
	import '@fontsource-variable/mona-sans/wght.css';
	import '@fontsource-variable/mona-sans/wght-italic.css';
	// Bitcount Prop Single: all axes, custom ones included.
	import '@fontsource-variable/bitcount-prop-single/full.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
	<a href="/">Bit Philology</a>
	<nav>
		<a href="/">Home</a>
		<a href="/events">Events</a>
		<a href="/outputs">Outputs</a>
		<a href="/team">Team</a>
	</nav>
</header>

{@render children()}

<footer>
	<p><a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a></p>
	<p><a href="https://www.dh.unibe.ch/">Digital Humanities, University of Bern</a></p>
	<div aria-label="Space for partner logos">
		<a href="https://www.dh.unibe.ch/" aria-label="Digital Humanities, University of Bern">
			<img
				class="h-20 w-auto"
				src="https://dhbern.github.io/logo.webp"
				alt="Digital Humanities, University of Bern logo"
			/>
		</a>
		<div>Logo space</div>
		<div>Logo space</div>
	</div>
</footer>
