# --- Estágio de Build ---
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do container.
WORKDIR /app

# Copia os arquivos do projeto para o diretório de trabalho.
# O COPY . . é o mais simples e eficaz agora que o contexto de build está correto.
COPY . .

# Instala as dependências do projeto usando yarn.
RUN yarn install 

# Executa o comando de build do seu package.json.
# O script "build" do seu package.json é "react-app-rewired build",
# que gera os arquivos estáticos na pasta 'build'.
RUN yarn run build

# --- Estágio de Produção ---
# Usa uma imagem leve de servidor web (Caddy é excelente para SPAs).
# Alternativa: FROM nginx:alpine
FROM caddy:2-alpine 
# <--- Use Caddy ou Nginx aqui

# Copia os arquivos compilados (da pasta 'build' do estágio 'builder')
# para o diretório de serviço do Caddy.
COPY --from=builder /app/build /usr/share/caddy

# Copia o arquivo de configuração do Caddy.
# Este arquivo é crucial para o roteamento de Single Page Applications (SPAs).
COPY Caddyfile /etc/caddy/Caddyfile

# Expõe as portas padrão HTTP e HTTPS.
EXPOSE 80 443 # O Coolify vai rotear para a porta 80 do seu container.

# Comando para iniciar o servidor Caddy em produção.
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
