FROM node:22-alpine

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código fonte
COPY . .

# Expõe a porta do Vite
EXPOSE 3000

# Executa o servidor de desenvolvimento do Vite com suporte a hosts externos
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
