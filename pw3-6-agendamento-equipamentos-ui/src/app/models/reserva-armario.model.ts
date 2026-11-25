/**
 * Espelha a entidade Java ReservaArmario.
 * LocalDate do Java trafega como string "AAAA-MM-DD".
 * id e ativo são definidos pelo backend, por isso são opcionais ao cadastrar.
 */
export interface ReservaArmario {
  id?: number;
  numeroArmario: number;
  nomeAluno: string;
  dataInicio: string;
  dataFim: string;
  ativo?: boolean;
}
