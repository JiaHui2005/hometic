FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables
ENV VITE_API_URL=http://localhost:8000/api

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
