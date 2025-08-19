#!/bin/sh
set -e

# Função para aguardar o PostgreSQL
wait_for_postgres() {
    echo "Aguardando Postgres em $DATABASE_URL ..."
    
    # Extrai os dados da connection string
    DB_HOST=$(echo $DATABASE_URL | sed 's/.*@\([^:]*\):.*/\1/')
    DB_PORT=$(echo $DATABASE_URL | sed 's/.*:\([0-9]*\)\/.*/\1/')
    DB_USER=$(echo $DATABASE_URL | sed 's/.*:\/\/\([^:]*\):.*/\1/')
    DB_NAME=$(echo $DATABASE_URL | sed 's/.*\/\([^?]*\).*/\1/')
    
    max_attempts=30
    attempt=1
    
    until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; do
        if [ $attempt -eq $max_attempts ]; then
            echo "Erro: Não foi possível conectar ao PostgreSQL após $max_attempts tentativas"
            exit 1
        fi
        
        echo "Sem conexão ainda... tentativa $attempt/$max_attempts"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "PostgreSQL está pronto!"
}

# Instala pg_isready se não estiver disponível
if ! command -v pg_isready >/dev/null 2>&1; then
    echo "Instalando postgresql-client..."
    apk add --no-cache postgresql-client
fi

wait_for_postgres

echo "Verificando Prisma Client..."
npx prisma generate

echo "Executando migrações do Prisma..."
npx prisma migrate deploy

echo "Iniciando aplicação NestJS na porta 3001..."
exec node dist/main.js