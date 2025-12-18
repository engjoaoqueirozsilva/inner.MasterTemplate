# --- Estágio de Build ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install 

RUN yarn run build

# --- Estágio de Produção ---
FROM caddy:2-alpine

# Copia os arquivos compilados
COPY --from=builder /app/build /usr/share/caddy

# CORREÇÃO: Path consistente (tudo minúsculo ou tudo com maiúscula)
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443

# CORREÇÃO: Path consistente
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]