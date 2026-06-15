create or replace view v_sources as
select
    id,
    name,
    description,
    created_at,
    created_by,
    updated_at,
    updated_by
from
    sources
where
    deleted_at is null
order by
    id asc
;

create or replace view v_thesauruses as
select
    account_id,
    merchant,
    ministry_id,
    tag_id,
    created_at,
    created_by,
    updated_at,
    updated_by
from
    thesauruses
where
    deleted_at is null
order by
    updated_at asc, created_at asc
;
