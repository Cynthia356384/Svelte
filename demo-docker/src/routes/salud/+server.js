// Ruta para el HEALTHCHECK de Docker: si responde 200, el contenedor está sano
export function GET() {
	return new Response('ok');
}
