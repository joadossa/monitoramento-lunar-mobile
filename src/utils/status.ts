export function isCritico(texto: string) {
  const valor = texto.toUpperCase();

  return (
    valor.includes("ALTO") ||
    valor.includes("ALERTA") ||
    valor.includes("ATENÇÃO") ||
    valor.includes("CRÍTICO") ||
    valor.includes("CRITICO")
  );
}