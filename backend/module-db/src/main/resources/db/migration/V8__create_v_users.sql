create or replace view v_users as
       select
           id,
           user_id,
           credential_id,
           public_key,
           signature_count,
           created_at,
           created_by,
           updated_at,
           updated_by
       from users
       where
           deleted_at is null
       order by
           id asc;