create or replace view v_tags as
select
    id,
    name,
    created_at,
    created_by,
    updated_at,
    updated_by
from
    tags
where
    deleted_at is null
order by
    id asc
;
