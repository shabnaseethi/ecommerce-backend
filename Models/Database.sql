-- const client = require('../config/dbconfig.js');

-- const execute = async (query) => {
--     try {
--         await client.connect();     // gets connection
--         await client.query(query);  // sends queries
--         return true;
--     } catch (error) {
--         console.error(error.stack);
--         return false;
--     } finally {
--         await client.end();         // closes connection
--     }
-- };

-- -- const createCustomer = `
-- --     CREATE TABLE IF NOT EXISTS "customer" (
-- -- 	    "id" SERIAL,
-- -- 	    "email" VARCHAR(200) NOT NULL,
-- -- 	    "password" VARCHAR(200) NOT NULL,
-- -- 	    "first_name" VARCHAR(200) NOT NULL,
-- --         "last_name" VARCHAR(200) NOT NULL
-- --     );`;

-- -- execute(createCustomer).then(result => {
-- --     if (result) {
-- --         console.log(' Customer Table created');
-- --     }
-- -- });


-- const createProduct = `
--     CREATE TABLE IF NOT EXISTS "customer" (
-- 	    "id" SERIAL,
-- 	    "email" VARCHAR(200) NOT NULL,
-- 	    "password" VARCHAR(200) NOT NULL,
-- 	    "first_name" VARCHAR(200) NOT NULL,
--         "last_name" VARCHAR(200) NOT NULL
--     );`;

-- -- execute(createCustomer).then(result => {
-- --     if (result) {
-- --         console.log(' Customer Table created');
-- --     }
-- -- });

-- module.exports = execute;

