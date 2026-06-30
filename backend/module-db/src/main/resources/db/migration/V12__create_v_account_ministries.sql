create or replace view v_account_ministries as
select
    am.account_id,
    m.id,
    m.name,
    m.description,
    m.created_at,
    m.created_by,
    m.updated_at,
    m.updated_by
from
    account_ministries am
join
    ministries m
    on am.ministry_id = m.id
where
    am.deleted_at is null
    and m.deleted_at is null
order by
    am.account_id asc,
    m.id asc
;

