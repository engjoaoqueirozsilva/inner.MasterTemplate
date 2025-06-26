# --- Estágio de Build ---
# Usa uma imagem Node.js para instalar dependências e compilar a aplicação.
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do container.
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (ou yarn.lock se usar yarn)
# para o diretório de trabalho. Isso permite que o Docker use o cache para npm install.
COPY package.json package-lock.json ./

# Instala as dependências do projeto.
# `--force --legacy-peer-deps` são opcionais, use se tiver problemas de dependência.
RUN npm install

# Copia o restante do código da aplicação.
COPY . .

# Executa o comando de build do seu package.json.
# O script "build" do seu package.json é "react-app-rewired build",
# que gera os arquivos estáticos na pasta 'build'.
RUN npm run build

# --- Estágio de Produção ---
# Usa uma imagem leve de servidor web (Caddy é excelente para SPAs).
# Alternativa: FROM nginx:alpine
FROM caddy:2-alpine

# Copia os arquivos compilados (da pasta 'build' do estágio 'builder')
# para o diretório de serviço do Caddy.
COPY --from=builder /app/build /usr/share/caddy

# Copia o arquivo de configuração do Caddy.
# Este arquivo é crucial para o roteamento de Single Page Applications (SPAs).
COPY Caddyfile /etc/caddy/Caddyfile

# Expõe as portas padrão HTTP e HTTPS.
EXPOSE 80 443

# Comando para iniciar o servidor Caddy em produção.
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
