# Configuração do Backend - Passo a Passo

Fala! Aqui está o guia rápido pra rodar nosso backend com Fastify, MySQL, Prisma e Docker. Se liga só:

---

## 1. O que você precisa ter instalado

Antes de tudo, garante que você tenha instalado na sua máquina:

-   Docker (pra rodar o banco)
-   Docker Compose
-   Node.js (versão 16 ou mais recente)
-   npm (gerenciador de pacotes do Node)

---

## 2. Clona o projeto e entra na pasta

```bash
git clone <URL-do-repo>
cd <nome-da-pasta>
```

---

## 3. Configura as variáveis de ambiente

Cria um arquivo `.env` na raiz do projeto, com isso aqui dentro:

Substitua <SENHA_AQUI> pela senha definida em docker-compose.yml (MYSQL_ROOT_PASSWORD)

```env
DATABASE_URL="mysql://root:<SENHA_AQUI>@localhost:3307/investdb""
```

se mudar alguma coisa no Docker (usuário, senha, porta), lembra de atualizar aqui também!

---

## 4. Sobe o banco com Docker

Roda o comando:

```bash
docker-compose up -d
```

Isso vai levantar o container do MySQL com tudo configurado.

---

## 5. Confirma se o banco está rodando

```bash
docker ps
```

Procura o container do MySQL na lista — se estiver lá, tá show!

---

## 6. Prepara o banco com o Prisma

Pra criar as tabelas e o esquema, roda:

```bash
npx prisma migrate dev --name init
```

Ou, se quiser só sincronizar sem criar migração:

```bash
npx prisma db push
```

---

## 7. Instala as dependências e inicia o servidor

```bash
npm install
npm run dev
```

O backend vai abrir no endereço: [http://localhost:3333](http://localhost:3333)

---

## 8. Testa as rotas principais

-   Criar cliente: `POST /clients`

    ```bash
    {
        "name": "Nome do cliente",
        "email": "email@exemplo.com",
        "status": true
    }
    ```

-   Listar todos os clientes: `GET /clients`
-   Busca cliente por ID `GET /clients/:id`
-   Listar clientes somente com status ativos: `GET /clients/active`
-   Atualizar cliente `PUT /clients/:id`

    ```bash
    {
        "name": "Nome atualizado",
        "email": "novoemail@exemplo.com",
        "status": false
    }
    ```

-   Criar ativos financeiros `POST /assets`

    ```bash
    {
        "name": "Nome do ativo",
        "value": 100.5,
        "clientId": 1
    }
    ```

-   Listar ativos financeiros (fixos): `GET /assets`

Usa Postman, Insomnia, ou o que preferir pra testar essas rotas.

---

## 9. Parar o banco quando quiser

Se precisar desligar o banco, só rodar:

```bash
docker-compose down
```

---

## Extras importantes

### docker-compose.yml (pra lembrar)

```yaml
version: "3.8"

services:
    db:
        image: mysql:8
        restart: always
        environment:
            MYSQL_ROOT_PASSWORD: rootpass
            MYSQL_DATABASE: investdb
            MYSQL_USER: investuser
            MYSQL_PASSWORD: investpass
        ports:
            - "3307:3306"
        volumes:
            - db_data:/var/lib/mysql

volumes:
    db_data:
```

### Script pra facilitar sua vida 😊

```yaml
    "scripts": {
        "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
        "prisma:migrate": "prisma migrate dev",
        "prisma:generate": "prisma generate",
        "prisma:studio": "prisma studio",
        "db:start": "docker-compose up -d",
        "db:stop": "docker-compose down"
    },
```

---

## Dicas rápidas

-   Se a porta `3307` estiver ocupada, muda ela tanto no `docker-compose.yml` quanto no `.env`.
-   Usuário, senha e banco do `.env` têm que bater com o que tá no Docker.
-   Quer apagar tudo e recomeçar o banco? Para o container e remove o volume com:

```bash
docker volume rm <nome_do_volume>
```

---

Ass: Lara Pedroso 💻 ❤️
