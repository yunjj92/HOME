drop view v_thesauruses;

create or replace view v_thesauruses as
select
    the.account_id,
    the.merchant,
    the.ministry_id,
    the.tag_id,
    tag.name as tag_name,
    the.created_at,
    the.created_by,
    the.updated_at,
    the.updated_by
from
    thesauruses the
left join
    tags tag
    on the.tag_id = tag.id
where
    the.deleted_at is null
order by
    the.updated_at asc, the.created_at asc
;
