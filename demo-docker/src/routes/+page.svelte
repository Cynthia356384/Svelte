<script>
	import { enhance } from '$app/forms';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Tareas del equipo · SvelteKit + Docker</title>
</svelte:head>

<main>
	<header>
		<h1>Tareas del equipo</h1>
		<p class="info">
			Servidor: <code>{data.servidor}</code> · Entorno: <code>{data.entorno}</code>
		</p>
	</header>

	<form method="POST" action="?/agregar" use:enhance class="nueva">
		<input name="texto" placeholder="Nueva tarea..." autocomplete="off" />
		<button>Agregar</button>
	</form>
	{#if form?.error}<p class="error">{form.error}</p>{/if}

	<ul>
		{#each data.tareas as tarea (tarea.id)}
			<li class:hecha={tarea.hecha}>
				<form method="POST" action="?/alternar" use:enhance>
					<input type="hidden" name="id" value={tarea.id} />
					<button class="check" aria-label="Marcar">{tarea.hecha ? '✓' : ''}</button>
				</form>
				<span>{tarea.texto}</span>
				<form method="POST" action="?/borrar" use:enhance>
					<input type="hidden" name="id" value={tarea.id} />
					<button class="borrar" aria-label="Borrar">✕</button>
				</form>
			</li>
		{:else}
			<li class="vacio">No hay tareas todavía.</li>
		{/each}
	</ul>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, sans-serif;
		background: #f3f6fa;
		color: #1d2733;
	}
	main {
		max-width: 520px;
		margin: 3rem auto;
		padding: 2rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 12px rgb(0 0 0 / 0.06);
	}
	h1 { margin: 0 0 0.25rem; }
	.info { margin: 0 0 1.5rem; color: #5b6878; font-size: 0.85rem; }
	code { background: #eaf1fb; padding: 0.1rem 0.35rem; border-radius: 4px; color: #1d63ed; }
	.nueva { display: flex; gap: 0.5rem; }
	.nueva input { flex: 1; padding: 0.6rem; border: 1px solid #cfd8e3; border-radius: 8px; font: inherit; }
	.nueva button { padding: 0.6rem 1rem; border: 0; border-radius: 8px; background: #1d63ed; color: white; font: inherit; cursor: pointer; }
	.error { color: #c62828; }
	ul { list-style: none; padding: 0; margin: 1.5rem 0 0; }
	li { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0; border-bottom: 1px solid #eef1f5; }
	li span { flex: 1; }
	li.hecha span { text-decoration: line-through; color: #98a3b0; }
	.vacio { color: #98a3b0; }
	.check { width: 1.4rem; height: 1.4rem; border: 2px solid #1d63ed; border-radius: 6px; background: white; color: #1d63ed; cursor: pointer; padding: 0; }
	.borrar { border: 0; background: none; color: #98a3b0; cursor: pointer; }
</style>
