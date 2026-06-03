export type Tela = "home" | "sensores" | "recursos" | "alertas" | "cadastro";

export type Sensor = {
  id?: number;
  nome: string;
  tipo: string;
  unidadeMedida: string;
  valorAtual: number;
  localizacao: string;
  status: string;
};

export type Reservatorio = {
  id: number;
  nome: string;
  tipoRecurso: string;
  capacidadeMaxima: number;
  quantidadeAtual: number;
  unidadeMedida: string;
  status: string;
};

export type ConsumoEnergia = {
  id: number;
  setor: string;
  consumoAtual: number;
  limiteConsumo: number;
  unidadeMedida: string;
  status: string;
};

export type Climatizacao = {
  id: number;
  setor: string;
  temperaturaAtual: number;
  umidadeAtual: number;
  nivelOxigenio: number;
  status: string;
};

export type AlertaOperacional = {
  id: number;
  titulo: string;
  descricao: string;
  nivelCriticidade: string;
  setor: string;
  status: string;
};

export type Indicadores = {
  totalItens: number;
  criticos: number;
  consumoAtual: number;
  energiaPercentual: number;
  recursosPercentual: number;
  saude: number;
};