# Monitoramento Lunar Mobile

Aplicativo mobile desenvolvido em **React Native com Expo e TypeScript** para monitoramento de recursos de uma base lunar.

O app permite visualizar e cadastrar sensores, recursos e alertas operacionais, consumindo dados de uma API backend em Spring Boot.

## Funcionalidades

* Dashboard inicial com status geral da base lunar
* Listagem de sensores
* Listagem de recursos operacionais
* Visualização de alertas
* Cadastro de sensores, recursos e alertas
* Exclusão individual ou em massa de registros
* Integração com API via requisições HTTP

## Tecnologias Utilizadas

* React Native
* Expo
* TypeScript
* JavaScript
* Fetch API

## Como Executar

Clone o repositório:

```bash
git clone https://github.com/joadossa/monitoramento-lunar-mobile.git
```

Acesse a pasta:

```bash
cd monitoramento-lunar-mobile
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm start
```

## Backend

O aplicativo consome uma API local na porta `8080`.

URL configurada:

```ts
const API_BASE_URL = "http://localhost:8080";
```

Caso esteja usando um celular físico, substitua `localhost` pelo IP da máquina onde a API está rodando.

Exemplo:

```ts
const API_BASE_URL = "http://192.168.0.10:8080";
```

## Autor

João Victor Pereira
RM: 550306

## Instituição

Projeto acadêmico desenvolvido para a FIAP.
