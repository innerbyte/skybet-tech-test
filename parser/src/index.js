"use strict"

const cluster = require("cluster");
const os = require("os");

let num_cpus = os.cpus().length;

if(cluster.isMaster) {
    console.log("Setting up " + num_cpus + " workers");

    for(let i = 0; i < num_cpus; ++i) {
        cluster.fork();
    }

    cluster.on("online", (worker) => {
        console.log("worker " + worker.process.pid + " is now online");
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log('worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log("starting a new worker...");

        // spawn another worker when one dies
        cluster.fork();
    });
}

let App = require("./app").instance;

App.start();