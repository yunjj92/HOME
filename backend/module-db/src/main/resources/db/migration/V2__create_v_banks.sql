create or replace view v_banks as
       select
           id,
           name,
           created_at,
           created_by,
           updated_at,
           updated_by
       from
           banks
       where
           deleted_at is null
;

