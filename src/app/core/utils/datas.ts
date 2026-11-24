/** Data/hora local para <input type="datetime-local">: yyyy-MM-ddTHH:mm. */
export function dataHoraIso(dias = 0, hora = '00:00'): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}T${hora}`;
}

/** Converte a string do backend/input em milissegundos (horário local). */
export function paraMs(valor: string): number {
  return new Date(valor).getTime();
}
