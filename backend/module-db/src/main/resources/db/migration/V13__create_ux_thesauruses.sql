create unique index ux_thesauruses_account_merchant
on thesauruses(account_id, merchant)
where deleted_at is null;