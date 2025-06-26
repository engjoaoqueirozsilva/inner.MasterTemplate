# --- Estágio de Build ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Estágio Final ---
# Não precisamos de um servidor web dedicado aqui.
# Apenas precisamos de um container leve que exponha os arquivos build.
# Uma imagem Alpine básica é suficiente.
FROM alpine/git:latest # Ou FROM scratch, se quiser o mínimo absoluto e lidar com dependências de runtime.
                        # Alpine/git é útil para ter algumas ferramentas básicas se precisar debugar.

# Copia os arquivos compilados da pasta 'build' do estágio 'builder'
# para um diretório que o Coolify pode montar e servir.
# O /app/build é o local padrão onde os arquivos serão gerados pelo npm run build.
# Vamos colocar em /usr/share/nginx/html (um caminho comum para web servers estáticos)
# para que o Coolify saiba onde encontrá-los e como servi-los com seu Traefik/Nginx.
COPY --from=builder /app/build /usr/share/nginx/html

# A porta 80 é a porta padrão para HTTP. O Traefik/Nginx do Coolify vai redirecionar para cá.
EXPOSE 80

# Este CMD é um placeholder. O Coolify (Traefik) é quem servirá a aplicação.
# Apenas mantém o container rodando para o Coolify poder interagir.
CMD ["/bin/sh", "-c", "trap : TERM INT; sleep infinity & wait"]
