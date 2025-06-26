# --- Estágio de Build ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos package.json e yarn.lock
COPY package.json ./

# Instala as dependências usando yarn
RUN yarn install --frozen-lockfile

# Copia o restante do código da aplicação.
COPY . .

# Executa o comando de build do seu package.json.
RUN yarn run build

# --- Estágio Final ---
FROM alpine/git:latest

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["/bin/sh", "-c", "trap : TERM INT; sleep infinity & wait"]
