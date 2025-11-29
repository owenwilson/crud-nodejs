# crud-nodejs
- simple CRUD app for Docker demo

## Build

```bash
docker build -t crud-nodejs:1.0.0 .
```

## Run

```bash
docker-compose up -d db
```

```bash
docker-compose up -d node-app
```

## Test

- open http://localhost:3000/products

## Clean

```bash
docker-compose down
```

- remove all containers, volumes, images, networks, and build cache