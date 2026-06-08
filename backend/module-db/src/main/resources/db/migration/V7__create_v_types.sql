create or replace view v_types as
select
    id,
    name,
    description,
    created_at,
    created_by,
    updated_at,
    updated_by
from
    types
where
    deleted_at is null
order by
    id asc
;
