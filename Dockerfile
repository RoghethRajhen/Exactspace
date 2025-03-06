# --- Scraper Stage ---
FROM node:18-slim AS scraper

WORKDIR /app

RUN apt-get update && apt-get install -y \
    chromium \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxkbcommon0 \
    libpango-1.0-0 \
    libxcursor1 \
    libnss3 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package.json package-lock.json ./
RUN npm install

COPY scrape.js .

ENV SCRAPE_URL=https://www.youtube.com/

RUN touch /app/scraped_data.json

RUN node scrape.js || echo '{"error": "Scraping failed"}' > /app/scraped_data.json

RUN ls -lh /app && cat /app/scraped_data.json || echo "File not found!"

# --- Server Stage ---
FROM python:3.10-slim AS server

WORKDIR /app

COPY --from=scraper /app/scraped_data.json .  

COPY server.py .

RUN pip install flask

EXPOSE 5000

CMD ["python", "server.py"]
