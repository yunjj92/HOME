create or replace view v_codes as
select
    id,
    type_id,
    code,
    name,
    description,
    created_at,
    created_by,
    updated_at,
    updated_by
from
    codes
where
    deleted_at is null
order by
    id asc
;

create or replace view v_accounts as
select
    acc.id
     , acc.bank_id
     , bnk.name as "bank_name"
     , acc.account_type
     , acc.name
     , acc.owner
     , acc.currency_type
     , acc.account_number
     , acc.description
     , acc.created_at
     , acc.created_by
     , acc.updated_at
     , acc.updated_by
from
    accounts acc
left join
    banks bnk
    on acc.bank_id = bnk.id
where
    acc.deleted_at is null
order by
    acc.id asc
;

create or replace view v_incomes as
select
    ent.id
     , ent.account_id
     , ent.date
     , ent.amount
     , inc.source_id
     , src.name as "source_name"
     , ent.created_at
     , ent.created_by
     , ent.updated_at
     , ent.updated_by
from
    entries ent
join
    incomes inc
    on ent.id = inc.entry_id
left join
    sources src
    on inc.source_id = src.id
where
    ent.deleted_at is null
order by
    ent.id asc
;

create or replace view v_expenses as
select
    ent.id
     , ent.account_id
     , ent.date
     , ent.amount
     , epn.merchant
     , epn.tag_id
     , tgs.name as "tag"
     , epn.ministry_id
     , mst.name as "ministry_name"
     , fe.fixed_id
     , fxd.name as "fixed_name"
     , ent.created_at
     , ent.created_by
     , ent.updated_at
     , ent.updated_by
from
    entries ent
join
    expenses epn
    on ent.id = epn.entry_id
left join
    tags tgs
    on epn.tag_id = tgs.id
left join
    ministries mst
    on epn.ministry_id = mst.id
left join
    fixed_expenses fe
    on epn.entry_id = fe.expense_id
left join
    fixed fxd
    on fe.fixed_id = fxd.id
where
    ent.deleted_at is null
order by
    ent.id asc
;

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
order by
   id asc
;

