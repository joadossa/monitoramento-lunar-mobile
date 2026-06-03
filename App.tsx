import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  DataCard,
  EmptyState,
  InfoLine,
  Input,
  MetricLine,
  SectionTitle,
  SidebarItem,
  StatCard,
  SummaryItem,
} from "./src/components/ui";

import {
  cadastrarAlertaApi,
  cadastrarReservatorioApi,
  cadastrarSensorApi,
  listarAlertas,
  listarClimatizacoes,
  listarConsumosEnergia,
  listarReservatorios,
  listarSensores,
  removerRegistroApi,
} from "./src/services/api";

import {
  AlertaOperacional,
  Climatizacao,
  ConsumoEnergia,
  Indicadores,
  Reservatorio,
  Sensor,
  Tela,
} from "./src/types";

import { isCritico } from "./src/utils/status";

type CadastroTipo = "sensor" | "recurso" | "alerta";

export default function App() {
  const [telaAtual, setTelaAtual] = useState<Tela>("home");
  const [cadastroTipo, setCadastroTipo] = useState<CadastroTipo>("sensor");

  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [reservatorios, setReservatorios] = useState<Reservatorio[]>([]);
  const [consumos, setConsumos] = useState<ConsumoEnergia[]>([]);
  const [climatizacoes, setClimatizacoes] = useState<Climatizacao[]>([]);
  const [alertas, setAlertas] = useState<AlertaOperacional[]>([]);

  const [carregando, setCarregando] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");

  const [sensoresSelecionados, setSensoresSelecionados] = useState<number[]>([]);
  const [reservatoriosSelecionados, setReservatoriosSelecionados] = useState<number[]>([]);
  const [consumosSelecionados, setConsumosSelecionados] = useState<number[]>([]);
  const [climatizacoesSelecionadas, setClimatizacoesSelecionadas] = useState<number[]>([]);
  const [alertasSelecionados, setAlertasSelecionados] = useState<number[]>([]);

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [status, setStatus] = useState("NORMAL");

  const [recursoNome, setRecursoNome] = useState("");
  const [recursoTipo, setRecursoTipo] = useState("");
  const [recursoCapacidade, setRecursoCapacidade] = useState("");
  const [recursoQuantidade, setRecursoQuantidade] = useState("");
  const [recursoUnidade, setRecursoUnidade] = useState("");
  const [recursoStatus, setRecursoStatus] = useState("OPERACIONAL");

  const [alertaTitulo, setAlertaTitulo] = useState("");
  const [alertaDescricao, setAlertaDescricao] = useState("");
  const [alertaCriticidade, setAlertaCriticidade] = useState("MÉDIO");
  const [alertaSetor, setAlertaSetor] = useState("");
  const [alertaStatus, setAlertaStatus] = useState("ABERTO");

  async function carregarDados(silencioso = false) {
    try {
      if (!silencioso) {
        setCarregando(true);
      }

      const [
        dadosSensores,
        dadosReservatorios,
        dadosConsumos,
        dadosClimatizacoes,
        dadosAlertas,
      ] = await Promise.all([
        listarSensores(),
        listarReservatorios(),
        listarConsumosEnergia(),
        listarClimatizacoes(),
        listarAlertas(),
      ]);

      setSensores(dadosSensores);
      setReservatorios(dadosReservatorios);
      setConsumos(dadosConsumos);
      setClimatizacoes(dadosClimatizacoes);
      setAlertas(dadosAlertas);

      setUltimaAtualizacao(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (error) {
      console.error("Erro ao carregar dados:", error);

      if (!silencioso) {
        alert("Não foi possível conectar com a API Spring Boot.");
      }
    } finally {
      if (!silencioso) {
        setCarregando(false);
      }
    }
  }

  useEffect(() => {
    carregarDados();

    const intervalo = setInterval(() => {
      carregarDados(true);
    }, 15000);

    return () => clearInterval(intervalo);
  }, []);

  function alternarSelecao(
    id: number,
    lista: number[],
    setLista: (ids: number[]) => void
  ) {
    if (lista.includes(id)) {
      setLista(lista.filter((item) => item !== id));
    } else {
      setLista([...lista, id]);
    }
  }

  async function cadastrarSensor() {
    if (!nome || !tipo || !unidadeMedida || !valorAtual || !localizacao || !status) {
      alert("Preencha todos os campos do sensor.");
      return;
    }

    const valorConvertido = Number(valorAtual.replace(",", "."));

    if (Number.isNaN(valorConvertido)) {
      alert("O campo 'Valor atual' precisa ser numérico.");
      return;
    }

    const novoSensor: Sensor = {
      nome: nome.trim(),
      tipo: tipo.trim(),
      unidadeMedida: unidadeMedida.trim(),
      valorAtual: valorConvertido,
      localizacao: localizacao.trim(),
      status: status.trim(),
    };

    try {
      await cadastrarSensorApi(novoSensor);

      alert("Sensor cadastrado com sucesso!");

      setNome("");
      setTipo("");
      setUnidadeMedida("");
      setValorAtual("");
      setLocalizacao("");
      setStatus("NORMAL");

      await carregarDados(true);
      setTelaAtual("sensores");
    } catch (error) {
      console.error("Erro ao cadastrar sensor:", error);
      alert("Erro ao cadastrar sensor. Verifique se a API está rodando.");
    }
  }

  async function cadastrarRecurso() {
    if (
      !recursoNome ||
      !recursoTipo ||
      !recursoCapacidade ||
      !recursoQuantidade ||
      !recursoUnidade ||
      !recursoStatus
    ) {
      alert("Preencha todos os campos do recurso.");
      return;
    }

    const capacidadeMaxima = Number(recursoCapacidade.replace(",", "."));
    const quantidadeAtual = Number(recursoQuantidade.replace(",", "."));

    if (Number.isNaN(capacidadeMaxima) || Number.isNaN(quantidadeAtual)) {
      alert("Capacidade e quantidade precisam ser numéricas.");
      return;
    }

    try {
      await cadastrarReservatorioApi({
        nome: recursoNome.trim(),
        tipoRecurso: recursoTipo.trim(),
        capacidadeMaxima,
        quantidadeAtual,
        unidadeMedida: recursoUnidade.trim(),
        status: recursoStatus.trim(),
      });

      alert("Recurso cadastrado com sucesso!");

      setRecursoNome("");
      setRecursoTipo("");
      setRecursoCapacidade("");
      setRecursoQuantidade("");
      setRecursoUnidade("");
      setRecursoStatus("OPERACIONAL");

      await carregarDados(true);
      setTelaAtual("recursos");
    } catch (error) {
      console.error("Erro ao cadastrar recurso:", error);
      alert("Erro ao cadastrar recurso. Verifique se a API está rodando.");
    }
  }

  async function cadastrarAlerta() {
    if (
      !alertaTitulo ||
      !alertaDescricao ||
      !alertaCriticidade ||
      !alertaSetor ||
      !alertaStatus
    ) {
      alert("Preencha todos os campos do alerta.");
      return;
    }

    try {
      await cadastrarAlertaApi({
        titulo: alertaTitulo.trim(),
        descricao: alertaDescricao.trim(),
        nivelCriticidade: alertaCriticidade.trim(),
        setor: alertaSetor.trim(),
        status: alertaStatus.trim(),
      });

      alert("Alerta cadastrado com sucesso!");

      setAlertaTitulo("");
      setAlertaDescricao("");
      setAlertaCriticidade("MÉDIO");
      setAlertaSetor("");
      setAlertaStatus("ABERTO");

      await carregarDados(true);
      setTelaAtual("alertas");
    } catch (error) {
      console.error("Erro ao cadastrar alerta:", error);
      alert("Erro ao cadastrar alerta. Verifique se a API está rodando.");
    }
  }

  async function removerRegistro(endpoint: string, id: number, nomeItem: string) {
    const confirmar = confirm(`Deseja remover "${nomeItem}"?`);

    if (!confirmar) {
      return;
    }

    try {
      await removerRegistroApi(endpoint, id);

      alert(`${nomeItem} removido com sucesso.`);

      await carregarDados(true);
    } catch (error) {
      console.error("Erro ao remover registro:", error);
      alert("Não foi possível remover o registro.");
    }
  }

  async function removerSelecionados(
    itens: { endpoint: string; id: number }[],
    limparSelecao: () => void
  ) {
    if (itens.length === 0) {
      alert("Nenhum item selecionado.");
      return;
    }

    const confirmar = confirm(`Deseja remover ${itens.length} item(ns) selecionado(s)?`);

    if (!confirmar) {
      return;
    }

    try {
      await Promise.all(
        itens.map((item) => removerRegistroApi(item.endpoint, item.id))
      );

      limparSelecao();
      await carregarDados(true);

      alert("Itens selecionados removidos com sucesso.");
    } catch (error) {
      console.error("Erro ao remover itens selecionados:", error);
      alert("Não foi possível remover os itens selecionados.");
    }
  }

  const indicadores: Indicadores = useMemo(() => {
    const totalItens =
      sensores.length +
      reservatorios.length +
      consumos.length +
      climatizacoes.length +
      alertas.length;

    const criticos =
      sensores.filter((item) => isCritico(item.status)).length +
      reservatorios.filter((item) => isCritico(item.status)).length +
      consumos.filter((item) => isCritico(item.status)).length +
      climatizacoes.filter((item) => isCritico(item.status)).length +
      alertas.filter((item) => isCritico(item.nivelCriticidade)).length;

    const consumoAtual = consumos.reduce(
      (total, item) => total + item.consumoAtual,
      0
    );

    const limiteEnergia = consumos.reduce(
      (total, item) => total + item.limiteConsumo,
      0
    );

    const energiaPercentual =
      limiteEnergia > 0
        ? Math.min((consumoAtual / limiteEnergia) * 100, 100)
        : 0;

    const capacidadeTotal = reservatorios.reduce(
      (total, item) => total + item.capacidadeMaxima,
      0
    );

    const quantidadeAtual = reservatorios.reduce(
      (total, item) => total + item.quantidadeAtual,
      0
    );

    const recursosPercentual =
      capacidadeTotal > 0
        ? Math.min((quantidadeAtual / capacidadeTotal) * 100, 100)
        : 0;

    const saude =
      totalItens > 0 ? Math.max(100 - (criticos / totalItens) * 100, 0) : 100;

    return {
      totalItens,
      criticos,
      consumoAtual,
      energiaPercentual,
      recursosPercentual,
      saude,
    };
  }, [sensores, reservatorios, consumos, climatizacoes, alertas]);

  function renderizarDashboard() {
    return (
      <View>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Dashboard Operacional</Text>
            <Text style={styles.pageSubtitle}>
              Monitoramento inteligente dos recursos críticos da base lunar
            </Text>
          </View>

          <View style={styles.autoSyncBox}>
            <Text style={styles.autoSyncTitle}>Auto Sync</Text>
            <Text style={styles.autoSyncText}>
              Atualiza a cada 15s
              {ultimaAtualizacao ? ` • ${ultimaAtualizacao}` : ""}
            </Text>
          </View>
        </View>

        <View style={styles.statGrid}>
          <StatCard
            icon="◉"
            label="Sensores"
            value={sensores.length}
            detail="ativos na base"
            color="#7C9DFF"
          />

          <StatCard
            icon="◇"
            label="Recursos"
            value={reservatorios.length}
            detail={`${indicadores.recursosPercentual.toFixed(0)}% disponível`}
            color="#8EDBD6"
          />

          <StatCard
            icon="▣"
            label="Energia"
            value={`${indicadores.energiaPercentual.toFixed(0)}%`}
            detail={`${indicadores.consumoAtual.toFixed(1)} kWh em uso`}
            color="#B69CFF"
          />

          <StatCard
            icon="△"
            label="Alertas"
            value={alertas.length}
            detail={`${indicadores.criticos} críticos`}
            color="#FF9C9C"
          />
        </View>

        <View style={styles.dashboardRow}>
          <View style={styles.largePanel}>
            <View style={styles.panelHeader}>
              <View>
                <Text style={styles.panelTitle}>Saúde da Operação</Text>
                <Text style={styles.panelSubtitle}>
                  Visão consolidada dos recursos monitorados
                </Text>
              </View>

              <View style={styles.badgeOnline}>
                <Text style={styles.badgeOnlineText}>ONLINE</Text>
              </View>
            </View>

            <View style={styles.healthArea}>
              <Text style={styles.healthValue}>
                {indicadores.saude.toFixed(0)}%
              </Text>
              <Text style={styles.healthLabel}>Índice geral de estabilidade</Text>
            </View>

            <MetricLine
              title="Capacidade de recursos"
              value={indicadores.recursosPercentual}
              color="#8EDBD6"
            />

            <MetricLine
              title="Carga energética"
              value={indicadores.energiaPercentual}
              color="#B69CFF"
            />

            <MetricLine
              title="Risco operacional"
              value={Math.min(indicadores.criticos * 20, 100)}
              color="#FF9C9C"
            />
          </View>

          <View style={styles.sidePanel}>
            <Text style={styles.panelTitle}>Resumo rápido</Text>

            <SummaryItem label="Total monitorado" value={indicadores.totalItens} />
            <SummaryItem label="Eventos críticos" value={indicadores.criticos} />
            <SummaryItem label="Climatizações" value={climatizacoes.length} />
            <SummaryItem label="Consumos" value={consumos.length} />

            <View style={styles.infoNotice}>
              <Text style={styles.infoNoticeTitle}>Central LunarOps</Text>
              <Text style={styles.infoNoticeText}>
                A dashboard é atualizada automaticamente a cada 15 segundos.
                Use o menu lateral para navegar entre os módulos.
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function renderizarSensores() {
    const itensSelecionados = sensoresSelecionados.map((id) => ({
      endpoint: "/sensores",
      id,
    }));

    return (
      <View>
        <SectionTitle
          title="Sensores"
          subtitle="Consulta, status, seleção e remoção dos sensores cadastrados"
        />

        <SelectionBar
          total={sensoresSelecionados.length}
          onDelete={() =>
            removerSelecionados(itensSelecionados, () => setSensoresSelecionados([]))
          }
          onClear={() => setSensoresSelecionados([])}
        />

        <View style={styles.cardList}>
          {sensores.map((sensor) => (
            <DataCard
              key={sensor.id}
              title={sensor.nome}
              status={sensor.status}
              selected={sensor.id ? sensoresSelecionados.includes(sensor.id) : false}
              onToggleSelect={
                sensor.id
                  ? () =>
                      alternarSelecao(
                        sensor.id!,
                        sensoresSelecionados,
                        setSensoresSelecionados
                      )
                  : undefined
              }
              onRemove={
                sensor.id
                  ? () => removerRegistro("/sensores", sensor.id!, sensor.nome)
                  : undefined
              }
            >
              <InfoLine label="Tipo" value={sensor.tipo} />
              <InfoLine label="Localização" value={sensor.localizacao} />
              <InfoLine
                label="Valor atual"
                value={`${sensor.valorAtual} ${sensor.unidadeMedida}`}
              />
            </DataCard>
          ))}
        </View>

        {sensores.length === 0 && <EmptyState text="Nenhum sensor cadastrado." />}
      </View>
    );
  }

  function renderizarRecursos() {
    const itensSelecionados = [
      ...reservatoriosSelecionados.map((id) => ({
        endpoint: "/reservatorios",
        id,
      })),
      ...consumosSelecionados.map((id) => ({
        endpoint: "/consumos-energia",
        id,
      })),
      ...climatizacoesSelecionadas.map((id) => ({
        endpoint: "/climatizacoes",
        id,
      })),
    ];

    function limparSelecionados() {
      setReservatoriosSelecionados([]);
      setConsumosSelecionados([]);
      setClimatizacoesSelecionadas([]);
    }

    return (
      <View>
        <SectionTitle
          title="Recursos Operacionais"
          subtitle="Reservatórios, energia e climatização da base"
        />

        <SelectionBar
          total={itensSelecionados.length}
          onDelete={() => removerSelecionados(itensSelecionados, limparSelecionados)}
          onClear={limparSelecionados}
        />

        <Text style={styles.categoryTitle}>Reservatórios</Text>

        <View style={styles.cardList}>
          {reservatorios.map((item) => (
            <DataCard
              key={item.id}
              title={item.nome}
              status={item.status}
              selected={reservatoriosSelecionados.includes(item.id)}
              onToggleSelect={() =>
                alternarSelecao(
                  item.id,
                  reservatoriosSelecionados,
                  setReservatoriosSelecionados
                )
              }
              onRemove={() => removerRegistro("/reservatorios", item.id, item.nome)}
            >
              <InfoLine label="Recurso" value={item.tipoRecurso} />
              <InfoLine
                label="Quantidade"
                value={`${item.quantidadeAtual} / ${item.capacidadeMaxima} ${item.unidadeMedida}`}
              />
            </DataCard>
          ))}
        </View>

        <Text style={styles.categoryTitle}>Energia</Text>

        <View style={styles.cardList}>
          {consumos.map((item) => (
            <DataCard
              key={item.id}
              title={item.setor}
              status={item.status}
              selected={consumosSelecionados.includes(item.id)}
              onToggleSelect={() =>
                alternarSelecao(item.id, consumosSelecionados, setConsumosSelecionados)
              }
              onRemove={() => removerRegistro("/consumos-energia", item.id, item.setor)}
            >
              <InfoLine
                label="Consumo atual"
                value={`${item.consumoAtual} ${item.unidadeMedida}`}
              />

              <InfoLine
                label="Limite"
                value={`${item.limiteConsumo} ${item.unidadeMedida}`}
              />
            </DataCard>
          ))}
        </View>

        <Text style={styles.categoryTitle}>Climatização</Text>

        <View style={styles.cardList}>
          {climatizacoes.map((item) => (
            <DataCard
              key={item.id}
              title={item.setor}
              status={item.status}
              selected={climatizacoesSelecionadas.includes(item.id)}
              onToggleSelect={() =>
                alternarSelecao(
                  item.id,
                  climatizacoesSelecionadas,
                  setClimatizacoesSelecionadas
                )
              }
              onRemove={() => removerRegistro("/climatizacoes", item.id, item.setor)}
            >
              <InfoLine label="Temperatura" value={`${item.temperaturaAtual}°C`} />
              <InfoLine label="Umidade" value={`${item.umidadeAtual}%`} />
              <InfoLine label="Oxigênio" value={`${item.nivelOxigenio}%`} />
            </DataCard>
          ))}
        </View>
      </View>
    );
  }

  function renderizarAlertas() {
    const itensSelecionados = alertasSelecionados.map((id) => ({
      endpoint: "/alertas",
      id,
    }));

    return (
      <View>
        <SectionTitle
          title="Alertas Operacionais"
          subtitle="Eventos críticos, seleção e remoção de alertas"
        />

        <SelectionBar
          total={alertasSelecionados.length}
          onDelete={() =>
            removerSelecionados(itensSelecionados, () => setAlertasSelecionados([]))
          }
          onClear={() => setAlertasSelecionados([])}
        />

        <View style={styles.cardList}>
          {alertas.map((alerta) => (
            <DataCard
              key={alerta.id}
              title={alerta.titulo}
              status={alerta.nivelCriticidade}
              selected={alertasSelecionados.includes(alerta.id)}
              onToggleSelect={() =>
                alternarSelecao(alerta.id, alertasSelecionados, setAlertasSelecionados)
              }
              onRemove={() => removerRegistro("/alertas", alerta.id, alerta.titulo)}
            >
              <InfoLine label="Setor" value={alerta.setor} />
              <InfoLine label="Descrição" value={alerta.descricao} />
              <InfoLine label="Status" value={alerta.status} />
            </DataCard>
          ))}
        </View>

        {alertas.length === 0 && (
          <EmptyState text="Nenhum alerta operacional encontrado." />
        )}
      </View>
    );
  }

  function renderizarCadastro() {
    return (
      <View>
        <SectionTitle
          title="Cadastros"
          subtitle="Cadastre sensores, recursos e alertas operacionais"
        />

        <View style={styles.cadastroTabs}>
          <CadastroTab
            label="Sensores"
            active={cadastroTipo === "sensor"}
            onPress={() => setCadastroTipo("sensor")}
          />

          <CadastroTab
            label="Recursos"
            active={cadastroTipo === "recurso"}
            onPress={() => setCadastroTipo("recurso")}
          />

          <CadastroTab
            label="Alertas"
            active={cadastroTipo === "alerta"}
            onPress={() => setCadastroTipo("alerta")}
          />
        </View>

        {cadastroTipo === "sensor" && renderizarCadastroSensor()}
        {cadastroTipo === "recurso" && renderizarCadastroRecurso()}
        {cadastroTipo === "alerta" && renderizarCadastroAlerta()}
      </View>
    );
  }

  function renderizarCadastroSensor() {
    return (
      <View style={styles.formPanel}>
        <Input
          label="Nome"
          value={nome}
          onChangeText={setNome}
          placeholder="Sensor de Oxigênio"
        />

        <Input
          label="Tipo"
          value={tipo}
          onChangeText={setTipo}
          placeholder="Oxigênio"
        />

        <Input
          label="Unidade"
          value={unidadeMedida}
          onChangeText={setUnidadeMedida}
          placeholder="%"
        />

        <Input
          label="Valor atual"
          value={valorAtual}
          onChangeText={setValorAtual}
          placeholder="21.5"
          keyboardType="numeric"
        />

        <Input
          label="Localização"
          value={localizacao}
          onChangeText={setLocalizacao}
          placeholder="Módulo Habitacional A"
        />

        <Input
          label="Status"
          value={status}
          onChangeText={setStatus}
          placeholder="NORMAL"
        />

        <TouchableOpacity style={styles.saveButton} onPress={cadastrarSensor}>
          <Text style={styles.saveButtonText}>Salvar Sensor</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderizarCadastroRecurso() {
    return (
      <View style={styles.formPanel}>
        <Input
          label="Nome do recurso"
          value={recursoNome}
          onChangeText={setRecursoNome}
          placeholder="Reservatório de Água Principal"
        />

        <Input
          label="Tipo do recurso"
          value={recursoTipo}
          onChangeText={setRecursoTipo}
          placeholder="Água Potável"
        />

        <Input
          label="Capacidade máxima"
          value={recursoCapacidade}
          onChangeText={setRecursoCapacidade}
          placeholder="10000"
          keyboardType="numeric"
        />

        <Input
          label="Quantidade atual"
          value={recursoQuantidade}
          onChangeText={setRecursoQuantidade}
          placeholder="7200"
          keyboardType="numeric"
        />

        <Input
          label="Unidade"
          value={recursoUnidade}
          onChangeText={setRecursoUnidade}
          placeholder="litros"
        />

        <Input
          label="Status"
          value={recursoStatus}
          onChangeText={setRecursoStatus}
          placeholder="OPERACIONAL"
        />

        <TouchableOpacity style={styles.saveButton} onPress={cadastrarRecurso}>
          <Text style={styles.saveButtonText}>Salvar Recurso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderizarCadastroAlerta() {
    return (
      <View style={styles.formPanel}>
        <Input
          label="Título"
          value={alertaTitulo}
          onChangeText={setAlertaTitulo}
          placeholder="Temperatura elevada"
        />

        <Input
          label="Descrição"
          value={alertaDescricao}
          onChangeText={setAlertaDescricao}
          placeholder="Laboratório Lunar acima da temperatura recomendada."
        />

        <Input
          label="Nível de criticidade"
          value={alertaCriticidade}
          onChangeText={setAlertaCriticidade}
          placeholder="ALTO"
        />

        <Input
          label="Setor"
          value={alertaSetor}
          onChangeText={setAlertaSetor}
          placeholder="Climatização"
        />

        <Input
          label="Status"
          value={alertaStatus}
          onChangeText={setAlertaStatus}
          placeholder="ABERTO"
        />

        <TouchableOpacity style={styles.saveButton} onPress={cadastrarAlerta}>
          <Text style={styles.saveButtonText}>Salvar Alerta</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderizarConteudo() {
    if (carregando) {
      return (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Carregando dados da base lunar...</Text>
        </View>
      );
    }

    if (telaAtual === "home") return renderizarDashboard();
    if (telaAtual === "sensores") return renderizarSensores();
    if (telaAtual === "recursos") return renderizarRecursos();
    if (telaAtual === "alertas") return renderizarAlertas();
    if (telaAtual === "cadastro") return renderizarCadastro();

    return null;
  }

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.layout}>
        <View style={styles.sidebar}>
          <View style={styles.brandTextOnly}>
            <Text style={styles.brandName}>LunarOps</Text>
            <Text style={styles.brandDescription}>Operations Center</Text>
          </View>

          <Text style={styles.menuLabel}>MENU</Text>

          <SidebarItem
            label="Home"
            icon="▦"
            active={telaAtual === "home"}
            onPress={() => setTelaAtual("home")}
          />

          <SidebarItem
            label="Sensores"
            icon="◉"
            active={telaAtual === "sensores"}
            onPress={() => setTelaAtual("sensores")}
          />

          <SidebarItem
            label="Recursos"
            icon="◇"
            active={telaAtual === "recursos"}
            onPress={() => setTelaAtual("recursos")}
          />

          <SidebarItem
            label="Alertas"
            icon="△"
            active={telaAtual === "alertas"}
            danger
            onPress={() => setTelaAtual("alertas")}
          />

          <SidebarItem
            label="Cadastro"
            icon="+"
            active={telaAtual === "cadastro"}
            onPress={() => setTelaAtual("cadastro")}
          />

          <View style={styles.sidebarFooter}>
            <Text style={styles.footerTitle}>API Status</Text>
            <Text style={styles.footerOnline}>● Spring Boot Online</Text>
            <Text style={styles.footerSync}>Auto Sync: 15s</Text>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.topbar}>
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>⌕</Text>

              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar recursos, sensores ou alertas..."
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.userTopbar}>
              <View style={styles.userInfoTopbar}>
                <Text style={styles.userNameTopbar}>João Victor</Text>
                <Text style={styles.userRoleTopbar}>RM 550306</Text>
              </View>

              <View style={styles.avatarTopbar}>
                <Text style={styles.avatarTopbarText}>JV</Text>
              </View>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {renderizarConteudo()}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

function SelectionBar({
  total,
  onDelete,
  onClear,
}: {
  total: number;
  onDelete: () => void;
  onClear: () => void;
}) {
  if (total === 0) {
    return null;
  }

  return (
    <View style={styles.selectionBar}>
      <Text style={styles.selectionText}>{total} item(ns) selecionado(s)</Text>

      <View style={styles.selectionActions}>
        <TouchableOpacity style={styles.clearSelectionButton} onPress={onClear}>
          <Text style={styles.clearSelectionText}>Limpar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bulkDeleteButton} onPress={onDelete}>
          <Text style={styles.bulkDeleteText}>Deletar selecionados</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CadastroTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.cadastroTab, active && styles.cadastroTabActive]}
      onPress={onPress}
    >
      <Text style={[styles.cadastroTabText, active && styles.cadastroTabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  layout: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 260,
    backgroundColor: "#1F2937",
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  brandTextOnly: {
    marginBottom: 32,
    paddingVertical: 10,
  },
  brandName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
  },
  brandDescription: {
    color: "#8EDBD6",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  menuLabel: {
    color: "#7C8799",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 10,
  },
  sidebarFooter: {
    marginTop: "auto",
    backgroundColor: "#273244",
    borderRadius: 16,
    padding: 14,
  },
  footerTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginBottom: 6,
  },
  footerOnline: {
    color: "#8EDBD6",
    fontSize: 12,
    fontWeight: "800",
  },
  footerSync: {
    color: "#A7B0C0",
    fontSize: 11,
    marginTop: 6,
    fontWeight: "700",
  },
  main: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  topbar: {
    height: 76,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5EAF2",
    paddingHorizontal: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchBox: {
    width: "50%",
    maxWidth: 580,
    backgroundColor: "#F5F7FB",
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchIcon: {
    color: "#94A3B8",
    fontSize: 18,
    fontWeight: "900",
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: "#1F2937",
  },
  userTopbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userInfoTopbar: {
    alignItems: "flex-end",
  },
  userNameTopbar: {
    color: "#1F2937",
    fontWeight: "900",
    fontSize: 14,
  },
  userRoleTopbar: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  avatarTopbar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  avatarTopbarText: {
    color: "#4F46E5",
    fontWeight: "900",
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 26,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "center",
    marginBottom: 22,
  },
  pageTitle: {
    color: "#1F2937",
    fontSize: 30,
    fontWeight: "900",
  },
  pageSubtitle: {
    color: "#64748B",
    marginTop: 6,
    fontSize: 14,
  },
  autoSyncBox: {
    backgroundColor: "#E7FAF7",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 11,
    alignItems: "flex-end",
  },
  autoSyncTitle: {
    color: "#0F9F8F",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  autoSyncText: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "700",
  },
  statGrid: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 22,
    flexWrap: "wrap",
  },
  dashboardRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 22,
  },
  largePanel: {
    flex: 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E9EEF6",
  },
  sidePanel: {
    flex: 1,
    minWidth: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E9EEF6",
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },
  panelTitle: {
    color: "#1F2937",
    fontSize: 19,
    fontWeight: "900",
  },
  panelSubtitle: {
    color: "#94A3B8",
    marginTop: 4,
    fontSize: 13,
  },
  badgeOnline: {
    backgroundColor: "#E7FAF7",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    height: 32,
  },
  badgeOnlineText: {
    color: "#0F9F8F",
    fontSize: 11,
    fontWeight: "900",
  },
  healthArea: {
    marginBottom: 20,
  },
  healthValue: {
    color: "#1F2937",
    fontSize: 44,
    fontWeight: "900",
  },
  healthLabel: {
    color: "#64748B",
    marginTop: 4,
  },
  infoNotice: {
    backgroundColor: "#EEF3FF",
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
  },
  infoNoticeTitle: {
    color: "#4F6FEB",
    fontWeight: "900",
    marginBottom: 4,
  },
  infoNoticeText: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
  },
  cardList: {
    gap: 14,
  },
  categoryTitle: {
    color: "#1F2937",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 12,
  },
  formPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E9EEF6",
    gap: 12,
  },
  saveButton: {
    backgroundColor: "#8EDBD6",
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
  },
  saveButtonText: {
    color: "#0F766E",
    textAlign: "center",
    fontWeight: "900",
  },
  loadingBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9EEF6",
  },
  loadingText: {
    color: "#64748B",
    marginTop: 14,
    fontWeight: "700",
  },
  cadastroTabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 8,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E9EEF6",
    gap: 8,
  },
  cadastroTab: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
  },
  cadastroTabActive: {
    backgroundColor: "#7C9DFF",
  },
  cadastroTabText: {
    color: "#64748B",
    textAlign: "center",
    fontWeight: "900",
  },
  cadastroTabTextActive: {
    color: "#FFFFFF",
  },
  selectionBar: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9EEF6",
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectionText: {
    color: "#1F2937",
    fontWeight: "900",
  },
  selectionActions: {
    flexDirection: "row",
    gap: 10,
  },
  clearSelectionButton: {
    backgroundColor: "#EEF3FF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  clearSelectionText: {
    color: "#4F6FEB",
    fontWeight: "900",
  },
  bulkDeleteButton: {
    backgroundColor: "#FFF1F2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bulkDeleteText: {
    color: "#E05263",
    fontWeight: "900",
  },
});