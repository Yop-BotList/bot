# Import nodejs version 16.x

FROM node:16

# Install packages

WORKDIR /usr/yopbot
COPY package.json .
RUN npm install

# Build the project from typescript to javascript
COPY . .
RUN npm run build
CMD ["npm", "run", "start:js"]