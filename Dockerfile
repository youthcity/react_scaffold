# Base image is version 6-onbuild of codemao-master
FROM registry.srv.codemao.cn:5000/codemao-master:6-onbuild

# Switch to unprivileged user
# Standard in codemao-master images
USER codemao

# Workdir is unprivileged user home
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json /usr/src/app
RUN npm install

# Copy application source code
COPY . /usr/src/app

# Build Application
RUN npm run build

EXPOSE 5000

# Entry point
ENTRYPOINT ["npm", "run"]
CMD ["production"]
