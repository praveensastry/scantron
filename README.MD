# Scantron

A REST api server that will process, store, and serve nmap results.

## Setup

### Requirements
- NodeJS v13.10.1 or higher

### Steps to start API Server (uses SQLite DB from this repo)
```bash
# Clone this repository:
git clone git@github.com:praveensastry/scantron.git --depth=1
cd scantron

# Install dependencies:
# Note:
# This also generates Prisma Client JS into `node_modules/@prisma/client` via a `postinstall` hook of the `@prisma/client` package from your `package.json`.
npm install

# Start the REST API server
node src/server.js
```

### Steps to start with a fresh DB

One of the benefits of using Prisma is complete DB abstraction, to make this solution work with another database MySQL / Postgres we just need to update the provider in `schema.prisma` file in the `prisma` folder.

```bash
# Clone this repository:
git clone git@github.com:praveensastry/scantron.git --depth=1
cd scantron

# Install dependencies:
# Note:
# This also generates Prisma Client JS into `node_modules/@prisma/client` via a `postinstall` hook of the `@prisma/client` package from your `package.json`.
npm install

# Note: You're using [npx](https://github.com/npm/npx) to run Prisma 2 CLI that's listed as a development dependency in [`package.json`](./package.json)
# Save the migration in the `prisma/migrations` folder
npx prisma migrate save --name 'init' --experimental

# Run Migrations
# Execute the migrations in the `prisma/migrations` folder
npx prisma migrate up --experimental

# Generate (Prisma) Database Client
npx prisma generate

# Seed the database with test data
npm run seed

# Start the REST API server
node src/server.js

```

## Usage Guide

1. To initiate a scan againist an array of hosts

```
curl --location --request POST 'http://localhost:3000/api/v1/scan' \
--header 'Content-Type: application/json' \
--data-raw '{
	"range": ["google.com", "scan.nmap.org"]
}'
```

2. To retrieve the scan results for a given host

```
curl --location --request GET 'http://localhost:3000/api/v1/scans?hostIdentifier=google.com' \
--data-raw ''
```

3. To retreive all hosts along with their scans
```
curl --location --request GET 'http://localhost:3000/api/v1/hostfeed'
```

4. To retreive all scans along with the hosts in each scan
```
curl --location --request GET 'http://localhost:3000/api/v1/scanfeed'
```

### Features
- Ability to input multiple IPs or hosts and the scans of those ip/hosts are done in
parallel (Using new NodeJS Worker threads)
- Indexed database tables (thanks to Prisma)
- Error and Input Validation through API middlewares
- Compression and CORS ready
- API Versioning
- Highly Configurable
- Easy to extend to multiple scanners

### Improvements
- Pagination for API responses
- Adding unit tests
- Adding a Queue for incoming requests from which workers would pull. (At the moment, main thread will post a message to the worker thread, which would trigger a scan on the worker thread.)
- Containerising by adding a dockerfile
- Ability to return port summary delta with the scan results

### Known Issues

- When working with SQLite DB, requests fail with `500` status as SQLite is busy. 