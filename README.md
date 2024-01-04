# Backend Service Deployment using Docker

This guide will walk you through the process of setting up, building, and running your Node.js backend service in a Docker container.

## Prerequisites

- Docker installed on your machine. To install Docker, follow the instructions on the [official Docker website](https://docs.docker.com/get-docker/).

## Setup

Clone the repository to your local machine:

git clone [Your Repository URL]
cd [Your Project Directory]

## Docker Build

To build the Docker image for your backend service, run the following command in the root directory of your project:

docker build -t your-app-name .

This command will use the `Dockerfile` in the current directory to build the Docker image and tag it with the name `your-app-name`.

## Running the Container

After building the image, you can run your application in a Docker container:

docker run -dp 3005:3005 your-app-name

This command will start a new Docker container based on the image you built, bind port `3005` of the container to port `3005` on the host machine, and run your Node.js application.
