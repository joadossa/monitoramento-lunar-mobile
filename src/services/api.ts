import {
  AlertaOperacional,
  Climatizacao,
  ConsumoEnergia,
  Reservatorio,
  Sensor,
} from "../types";

const API_BASE_URL = "http://localhost:8080";

async function buscarDados<T>(endpoint: string): Promise<T> {
  const resposta = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(`Erro HTTP ${resposta.status}: ${erro}`);
  }

  return resposta.json();
}

export async function listarSensores(): Promise<Sensor[]> {
  return buscarDados<Sensor[]>("/sensores");
}

export async function listarReservatorios(): Promise<Reservatorio[]> {
  return buscarDados<Reservatorio[]>("/reservatorios");
}

export async function listarConsumosEnergia(): Promise<ConsumoEnergia[]> {
  return buscarDados<ConsumoEnergia[]>("/consumos-energia");
}

export async function listarClimatizacoes(): Promise<Climatizacao[]> {
  return buscarDados<Climatizacao[]>("/climatizacoes");
}

export async function listarAlertas(): Promise<AlertaOperacional[]> {
  return buscarDados<AlertaOperacional[]>("/alertas");
}

export async function cadastrarSensorApi(sensor: Sensor): Promise<void> {
  const resposta = await fetch(`${API_BASE_URL}/sensores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(sensor),
  });

  const respostaTexto = await resposta.text();

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}: ${respostaTexto}`);
  }
}

export async function cadastrarReservatorioApi(
  reservatorio: Omit<Reservatorio, "id">
): Promise<void> {
  const resposta = await fetch(`${API_BASE_URL}/reservatorios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(reservatorio),
  });

  const respostaTexto = await resposta.text();

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}: ${respostaTexto}`);
  }
}

export async function cadastrarAlertaApi(
  alerta: Omit<AlertaOperacional, "id">
): Promise<void> {
  const resposta = await fetch(`${API_BASE_URL}/alertas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(alerta),
  });

  const respostaTexto = await resposta.text();

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}: ${respostaTexto}`);
  }
}

export async function removerRegistroApi(
  endpoint: string,
  id: number
): Promise<void> {
  const resposta = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
    method: "DELETE",
  });

  if (!resposta.ok && resposta.status !== 204) {
    const erro = await resposta.text();
    throw new Error(erro);
  }
}