// Pequeña "base de datos" en un archivo JSON.
// La carpeta se define con la variable de entorno DATA_DIR.
// En Docker la montamos como volumen para que los datos no se pierdan.
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const DATA_DIR = process.env.DATA_DIR ?? './data';
const ARCHIVO = path.join(DATA_DIR, 'tareas.json');

/** @typedef {{ id: string, texto: string, hecha: boolean }} Tarea */

/** @returns {Tarea[]} */
export function leerTareas() {
	try {
		return JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'));
	} catch {
		return [];
	}
}

/** @param {Tarea[]} tareas */
function guardar(tareas) {
	fs.mkdirSync(DATA_DIR, { recursive: true });
	fs.writeFileSync(ARCHIVO, JSON.stringify(tareas, null, 2));
}

/** @param {string} texto */
export function agregarTarea(texto) {
	const tareas = leerTareas();
	tareas.push({ id: randomUUID(), texto, hecha: false });
	guardar(tareas);
}

/** @param {string} id */
export function alternarTarea(id) {
	const tareas = leerTareas().map((t) => (t.id === id ? { ...t, hecha: !t.hecha } : t));
	guardar(tareas);
}

/** @param {string} id */
export function borrarTarea(id) {
	guardar(leerTareas().filter((t) => t.id !== id));
}
