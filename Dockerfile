# Define a imagem base
FROM node:20

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo package.json e yarn.lock para o diretório de trabalho
COPY package.json ./
COPY yarn.lock ./

# Instala as dependências da aplicação
RUN yarn install

# Copia o código-fonte da aplicação para o diretório de trabalho
COPY . .