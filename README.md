# Introduction

### Geo-Queries R&D Project with Typescript + NodeJS + Express + Sequelize ORM.

# Summary

This is an R&D project to identify scalable solution for Geo-based Queries.

Geo-queries can be done in more than one way with diff complexities and performance, using diff tech stacks and algorithims based on variety of use cases, the most widely used algo for calculating distance b/w two co-ordinates have been haversine formula(we're not going to use it in this POC though).

Here are some of the best approaches we came accross while looking for a solution for sclable geo-queries.
we're going to see 3 approaches for Geo-queries.

### POSTGIS (postgres)

Pros:
  - no edge cases
  - highest accuracy
  - ability to change the spatial reference identifier, or SRID
Cons:
  - highest complexity, including non-SQL-standard column types and potentially some understanding of planar coordinate systems
  - requires the use of PostGIS provided columns (or requires you to cast the data type to a PostGIS spatial type)
  - if you want to have different units of measurement returned, you'll need to change your projection (use the non-default SRID), or convert yourself
  - comes with a 5000+ row table and three views that you will likely not be using if your use case is geolocations within the default SRID

### EarthDistance cubes(postgres)

Pros:
  - officially supported by Postgres
  - can be used with standard Postgres columns
  - no edge cases
  - good support for GIST indexing
Cons:
  - assumes the earth is perfectly spherical

### ElasticSearch
  Pros
    - highest accuracy and handle super large dataset with ease
    - hihgly performant
  Cons:
    - standalone Search service


#### The Accuracy diff b/w POSTGIS and earthdistance would be arround (~30 m) which is fairly acceptable for near by radius search and performance gain are reletavely much higher and considerable for simple use cases such as just finding near by co-ordinates.

In this POC we are going to mainly see the performance and precision of EarthDistance(postgres extension) with half a million of geo-based data of cargo trucks.

# Getting Started

## Installation

- git clone the repo

- Do npm installation in the root directory of the project

```bash
npm install
```
## Configure your database

- Create a postgres databse for development ,then set the db configs in

```bash
config/database.json
```

- setup the development db schema

```bash
npm run migrate
```

- seed the development db

```bash
npm run seed
```
- note i have created a seed json file in db/seeders which is used by the project seeders and holds upto half a millions records for co-ordinate based truck data. it might take upto 40-50s to seed this much data.

## Run the project


```bash
npm run start
```

Your web server is now exposed on http://localhost:3000

- note you can change the system level configs such as PORT, DISTANCE_RANGE( radius for Geo-queries ) in .evn.ts file at root of the project or set them at runtime by

```bash
DISTANCE_RANGE = 10 npm run start
```

## Postman Collection

The [Postman Collection] (https://www.getpostman.com/collections/e6a3a16f368d9980c31b)


## Build

```bash
npm run build
```

## Testing

### Configure the testing database

- Create a postgres databse for testing ,then set the db configs in

```bash
config/database.json
```

- setup the test db schema

```bash
npm run migrate:test
```

- seed the test db

```bash
npm run seed:test
```

### Run the test cases

```bash
npm run test
```

# Conclusion

## EXPLAIN ANALYZE for a Sample Query

```bash
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Sort  (cost=1982.65..1982.70 rows=18 width=612) (actual time=38.118..38.139 rows=276 loops=1)
   Sort Key: (round((sec_to_gc(cube_distance('(-1813530.512837093, -3862004.149776918, 4740997.580925211)'::cube, (ll_to_earth(trucks.lat, trucks.lng))::cube)))::numeric, 2))
   Sort Method: quicksort  Memory: 63kB
   ->  Bitmap Heap Scan on trucks  (cost=39.96..1982.28 rows=18 width=612) (actual time=10.915..37.734 rows=276 loops=1)
         Recheck Cond: ('(-1823530.5118128646, -3872004.1487526894, 4730997.58194944),(-1803530.5138613216, -3852004.1508011464, 4750997.579900983)'::cube @> (ll_to_earth(lat, lng))::cube)
         Filter: (((max_weight - curr_weight) >= 900) AND ((max_pallets - curr_pallets) >= 24) AND (sec_to_gc(cube_distance('(-1813530.512837093, -3862004.149776918, 4740997.580925211)'::cube, (ll_to_earth(lat, lng))::cube)) < '10000'::double precision))
         Rows Removed by Filter: 56124
         Heap Blocks: exact=2108
         ->  Bitmap Index Scan on trucks_location_idx  (cost=0.00..39.95 rows=489 width=0) (actual time=9.834..9.835 rows=56408 loops=1)
               Index Cond: ((ll_to_earth(lat, lng))::cube <@ '(-1823530.5118128646, -3872004.1487526894, 4730997.58194944),(-1803530.5138613216, -3852004.1508011464, 4750997.579900983)'::cube)
 Planning Time: 2.664 ms
 Execution Time: 38.354 ms
(12 rows)
```
