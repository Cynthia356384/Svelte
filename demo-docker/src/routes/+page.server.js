import os from 'node:os';
import { fail } from '@sveltejs/kit';
import { leerTareas, agregarTarea, alternarTarea, borrarTarea } from '#lib/server/tareas.js';

export function load() {
	return {
		tareas: leerTareas(),
		// Dentro de Docker, el hostname es el ID del contenedor
		servidor: os.hostname(),
		entorno: process.env.APP_ENV ?? 'local'
	};
}

export const actions = {
	agregar: async ({ request }) => {
		const datos = await request.formData();
		const texto = String(datos.get('texto') ?? '').trim();
		if (!texto) return fail(400, { error: 'Escribe una tarea' });
		agregarTarea(texto);
	},
	alternar: async ({ request }) => {
		const datos = await request.formData();
		alternarTarea(String(datos.get('id')));
	},
	borrar: async ({ request }) => {
		const datos = await request.formData();
		borrarTarea(String(datos.get('id')));
	}
};
