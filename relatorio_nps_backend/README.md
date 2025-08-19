# Relatório NPS - Backend

Este é o backend para a aplicação de Relatório de NPS. É construído com [NestJS](https://nestjs.com/) e usa [Prisma](https://www.prisma.io/) para o ORM.

## Visão Geral

O backend expõe uma API REST para gerenciar empresas, feedbacks e para calcular o Net Promoter Score (NPS).

## Primeiros Passos

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm, yarn, ou pnpm
- Um banco de dados PostgreSQL em execução

### Instalação

1.  Clone o repositório.
2.  Navegue até o diretório `relatorio_nps_backend`.
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Crie um arquivo `.env` na raiz do diretório `relatorio_nps_backend` e configure a variável de ambiente `DATABASE_URL`:
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```
5.  Execute as migrações do Prisma para criar as tabelas do banco de dados:
    ```bash
    npx prisma migrate dev
    ```

### Executando a Aplicação

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3001`.

## Docker e `entrypoint.sh`

O `entrypoint.sh` é um script de inicialização para o contêiner Docker. Ele garante que o banco de dados esteja acessível antes de iniciar a aplicação. Suas principais funções são:

1.  **Aguardar o PostgreSQL**: Verifica a conexão com o banco de dados e aguarda até que ele esteja pronto para aceitar conexões.
2.  **Gerar o Prisma Client**: Executa `npx prisma generate` para garantir que o cliente Prisma esteja atualizado com o schema.
3.  **Executar Migrações**: Aplica as migrações pendentes do banco de dados com `npx prisma migrate deploy`.
4.  **Iniciar a Aplicação**: Inicia o servidor NestJS com `node dist/main.js`.

## Endpoints da API

A seguir estão os endpoints disponíveis na API.

### Companies

#### `GET /companies`

Retorna uma lista de todas as empresas.

-   **Método:** `GET`
-   **Endpoint:** `/companies`
-   **Resposta de Sucesso (200 OK):**
    ```json
    [
      {
        "id": "rdx...",
        "name": "Radix",
        "createdAt": "2025-08-19T10:00:00.000Z"
      }
    ]
    ```

### Feedback

#### `POST /feedback`

Cria um novo feedback. Se a empresa não existir, ela será criada.

-   **Método:** `POST`
-   **Endpoint:** `/feedback`
-   **Corpo da Requisição:**
    ```json
    {
      "companyName": "Nome da Empresa",
      "rating": 5,
      "comment": "Ótimo serviço!",
      "userName": "João"
    }
    ```
-   **Resposta de Sucesso (201 Created):**
    ```json
    {
      "id": "clz...",
      "companyId": "clx...",
      "rating": 5,
      "comment": "Ótimo serviço!",
      "userName": "João",
      "createdAt": "2023-10-27T10:00:00.000Z"
    }
    ```

#### `GET /feedback`

Retorna uma lista de feedbacks. Pode ser filtrado por `companyId` ou `companyName`.

-   **Método:** `GET`
-   **Endpoint:** `/feedback`
-   **Parâmetros de Query:**
    -   `companyId` (opcional): ID da empresa para filtrar os feedbacks.
    -   `companyName` (opcional): Nome da empresa para filtrar os feedbacks.
-   **Resposta de Sucesso (200 OK):**
    ```json
    [
      {
        "id": "clz...",
        "companyId": "clx...",
        "rating": 5,
        "comment": "Ótimo serviço!",
        "userName": "João",
        "createdAt": "2023-10-27T10:00:00.000Z"
      }
    ]
    ```

### NPS

#### `GET /nps`

Calcula e retorna os dados de NPS. Pode ser filtrado por `companyId` ou `companyName`.

-   **Método:** `GET`
-   **Endpoint:** `/nps`
-   **Parâmetros de Query:**
    -   `companyId` (opcional): ID da empresa para calcular o NPS.
    -   `companyName` (opcional): Nome da empresa para calcular o NPS.
-   **Resposta de Sucesso (200 OK):**
    ```json
    {
      "totalResponses": 100,
      "promoters": 70,
      "neutrals": 20,
      "detractors": 10,
      "npsScore": 60,
      "companies": [
        {
          "companyId": "clx...",
          "name": "Empresa A",
          "feedbacks": [
            {
              "comment": "Ótimo serviço!",
              "userName": "João"
            }
          ]
        }
      ]
    }
    ```

## Esquema do Banco de Dados

O esquema do banco de dados é definido no arquivo `prisma/schema.prisma`.

### Modelo `Company`

| Campo     | Tipo     | Descrição                  |
| :-------- | :------- | :------------------------- |
| `id`      | `String` | Identificador único (CUID) |
| `name`    | `String` | Nome da empresa (único)    |
| `createdAt` | `DateTime` | Data de criação            |

### Modelo `Feedback`

| Campo       | Tipo     | Descrição                               |
| :---------- | :------- | :---------------------------------------- |
| `id`        | `String` | Identificador único (CUID)              |
| `companyId` | `String` | ID da empresa relacionada               |
| `rating`    | `Int`    | Avaliação (de 0 a 5)                    |
| `comment`   | `String?`| Comentário opcional                     |
| `userName`  | `String?`| Nome do usuário opcional                |
| `createdAt` | `DateTime` | Data de criação                         |