# Utiliser une image Node.js LTS
FROM node:18

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# Installer Expo CLI globalement
RUN npm install -g expo-cli @expo/ngrok@4.1.0

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./
COPY babel.config.js ./

# Installer les dépendances du projet
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port utilisé par Expo
EXPOSE 19000 19001 19002

# Commande par défaut pour démarrer l'application
CMD ["npm", "start"]