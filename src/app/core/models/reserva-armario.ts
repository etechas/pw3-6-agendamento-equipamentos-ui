/** Espelha a entidade Java ReservaArmario (tabela RES_ARMARIO). */
export interface ReservaArmario {
  id?: number;
  numeroArmario: string;
  nomeAluno: string;
  dataInicio: string; // LocalDateTime: yyyy-MM-ddTHH:mm[:ss]
  dataFim: string;    // LocalDateTime: yyyy-MM-ddTHH:mm[:ss]
  ativo?: boolean;
}
