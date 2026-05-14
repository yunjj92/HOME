create or replace view v_ministries as
select
    id,
    name,
    description,
    created_at,
    created_by,
    updated_at,
    updated_by
from
    ministries
where
    deleted_at is null
;

