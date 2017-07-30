# SkyBet Tech Test

This project is split into 3 modules: **connector**, **parser** & **web**.

* The **connector** module retrieves the packets from the mock data feed service and produces data to be consumed via **RabbitMQ** (provided in a docker container).
* The **parser** module consumes the data, parses it and saves it into **MongoDB**.
* The **web** module is written using **TypeScript** and **Angular 4** and provides a web interface for visualising the data stored in **MongoDB**

## Getting Started

* Install [Docker](https://docs.docker.com/engine/installation/) and [Docker Compose](https://docs.docker.com/compose/install/)
* Start the **Docker** containers by typing `docker-compose up` in the root directory (where **docker-compose.yml** resides). This will build and start the **RabbitMQ**, **mongo**, **data feed**, **connector**, **parser** & **web** containers.
* Once all the containers have started running, please open a browser and navigate to <http://localhost:8585> in order to test the data feed via the web interface.
*Please note that it might take a few moments for the feeds to show up in the UI, as they will usually be created with `displayed: false` and updated to `displayed: true` through **update** operations*
* In order to close and destroy the environment, please press `CTRL + C` followed by `docker-compose down`.

