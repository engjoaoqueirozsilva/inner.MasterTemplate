# --- Estágio de Build ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos package.json e yarn.lock
# Pode ser que o problema esteja aqui, vamos tentar um ADD . .
# COPY package.json yarn.lock ./

# Em vez do COPY específico, vamos COPIAR TUDO de uma vez
# Isso força o contexto completo para dentro do WORKDIR
COPY . .

# Instala as dependências usando yarn
# Se COPY . . for antes, yarn install vai rodar com todos os arquivos presentes
RUN yarn install

# Executa o comando de build do seu package.json.
RUN yarn run build

# --- Estágio Final ---
FROM alpine/git:latest

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["/bin/sh", "-c", "trap : TERM INT; sleep infinity & wait"]
