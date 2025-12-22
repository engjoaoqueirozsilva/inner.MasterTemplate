# --- Estágio de Build ---
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build

# --- Estágio de Produção ---
FROM nginx:alpine

# Remove config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Config Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
