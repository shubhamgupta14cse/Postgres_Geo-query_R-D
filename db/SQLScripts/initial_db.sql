CREATE EXTENSION earthdistance CASCADE;

CREATE TABLE trucks (
  id           BIGSERIAL PRIMARY KEY,
  license_no   VARCHAR(256) NOT NULL,
	max_weight   INTEGER NOT NULL,
	curr_Weight  INTEGER NOT NULL DEFAULT 0,
	max_pallets  INTEGER NOT NULL,
	curr_pallets INTEGER NOT NULL DEFAULT 0,
  lat          DOUBLE PRECISION NOT NULL,
  lng          DOUBLE PRECISION NOT NULL,
	created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);

CREATE INDEX trucks_location_idx ON trucks USING gist (ll_to_earth(lat, lng));


-- SELECT *, ROUND(earth_distance(ll_to_earth('48.014703', '-115.15394'), ll_to_earth(lat, lng))::NUMERIC, 2) AS distance
--     FROM
--       (
--         SELECT *
--         FROM
--          trucks
--         WHERE
--          (max_weight - curr_weight) >= '900'
--          AND (max_pallets - curr_pallets) >= '24'
--       ) AS filtered_trucks
--     WHERE
--       earth_box(ll_to_earth ('48.014703', '-115.15394'), (10 * 1000)) @> ll_to_earth (lat, lng)
--       AND earth_distance(ll_to_earth ('48.014703', '-115.15394'), ll_to_earth (lat, lng)) < (10 * 1000)
--     ORDER BY
--       distance


-- @@@@@@@@@@@@@
-- EXPLAIN ANALYZE for the Query
-- @@@@@@@@@@@@@


---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--  Sort  (cost=1982.65..1982.70 rows=18 width=612) (actual time=38.118..38.139 rows=276 loops=1)
--    Sort Key: (round((sec_to_gc(cube_distance('(-1813530.512837093, -3862004.149776918, 4740997.580925211)'::cube, (ll_to_earth(trucks.lat, trucks.lng))::cube)))::numeric, 2))
--    Sort Method: quicksort  Memory: 63kB
--    ->  Bitmap Heap Scan on trucks  (cost=39.96..1982.28 rows=18 width=612) (actual time=10.915..37.734 rows=276 loops=1)
--          Recheck Cond: ('(-1823530.5118128646, -3872004.1487526894, 4730997.58194944),(-1803530.5138613216, -3852004.1508011464, 4750997.579900983)'::cube @> (ll_to_earth(lat, lng))::cube)
--          Filter: (((max_weight - curr_weight) >= 900) AND ((max_pallets - curr_pallets) >= 24) AND (sec_to_gc(cube_distance('(-1813530.512837093, -3862004.149776918, 4740997.580925211)'::cube, (ll_to_earth(lat, lng))::cube)) < '10000'::double precision))
--          Rows Removed by Filter: 56124
--          Heap Blocks: exact=2108
--          ->  Bitmap Index Scan on trucks_location_idx  (cost=0.00..39.95 rows=489 width=0) (actual time=9.834..9.835 rows=56408 loops=1)
--                Index Cond: ((ll_to_earth(lat, lng))::cube <@ '(-1823530.5118128646, -3872004.1487526894, 4730997.58194944),(-1803530.5138613216, -3852004.1508011464, 4750997.579900983)'::cube)
--  Planning Time: 2.664 ms
--  Execution Time: 38.354 ms
-- (12 rows)
