const pool = require('./pool');
pool.on('connect', () => {
    console.log('connected to the db');
});

let queries = [`CREATE TABLE public.tbl_base
(
    creator_id integer,
    editor_id integer,
    edit_date timestamp with time zone,
    create_date timestamp with time zone,
    row_status character varying COLLATE pg_catalog."default"
)`,
    `CREATE TABLE public.user (
                id serial,
                username character varying(100) COLLATE pg_catalog."default" NOT NULL,
                name character varying(100) COLLATE pg_catalog."default",
                password character varying(500) COLLATE pg_catalog."default" NOT NULL,
                last_login timestamp with time zone,
                role character varying(100) COLLATE pg_catalog."default",               
                enabled boolean DEFAULT true,              
                CONSTRAINT users_pkey PRIMARY KEY (id),
                CONSTRAINT users_username_key UNIQUE (username)
            )   INHERITS (public.tbl_base) `,
    
    `CREATE TABLE public.per_structure (
                id serial,
                entity_name_id integer,
                item_creator_id character varying(500),
                item_approver_id character varying(500),
                item_viewer_id character varying(500),
                item_editor_id character varying(500),              
                CONSTRAINT per_structure_pkey PRIMARY KEY (id),
                CONSTRAINT "uniqe_entity_name" UNIQUE (entity_name_id)
            )`];
const createAllTables = () => {
    queries.forEach(async(Query) => {
       let res=await pool.query(Query);
            // .then((res) => {
                console.log(res);
                 pool.end();
            // })
            // .catch((err) => {
            //     console.log(err);
            //     pool.end();
            // });
    });
}
createAllTables();