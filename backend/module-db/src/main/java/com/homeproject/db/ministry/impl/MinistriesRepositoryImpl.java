package com.homeproject.db.ministry.impl;

import com.homeproject.db.jooq.tables.records.MinistriesRecord;
import com.homeproject.db.ministry.MinistriesRepository;
import com.homeproject.db.ministry.dto.AccountMinistryProjection;
import com.homeproject.db.ministry.dto.MinistryCommand;
import com.homeproject.db.ministry.dto.MinistryProjection;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.homeproject.db.jooq.Tables.MINISTRIES;
import static com.homeproject.db.jooq.Tables.V_ACCOUNT_MINISTRIES;
import static com.homeproject.db.jooq.tables.VMinistries.V_MINISTRIES;
import static org.jooq.impl.DSL.currentOffsetDateTime;

@Repository
@RequiredArgsConstructor
public class MinistriesRepositoryImpl implements MinistriesRepository {

    private final DSLContext dsl;

    @Override
    public List<MinistryProjection> getMinistryList() {
        return dsl
                .selectFrom(V_MINISTRIES)
                .fetchInto(MinistryProjection.class);
    }

    @Override
    public List<AccountMinistryProjection> getAccountMinistryList() {
        return dsl
                .selectFrom(V_ACCOUNT_MINISTRIES)
                .fetchInto(AccountMinistryProjection.class);
    }

    @Override
    public Integer insertMinistry(MinistryCommand ministryCommand) {
        MinistriesRecord ministriesRecord = dsl.insertInto(MINISTRIES)
                .set(MINISTRIES.NAME, ministryCommand.name())
                .set(MINISTRIES.DESCRIPTION, ministryCommand.description())
                .set(MINISTRIES.CREATED_AT, currentOffsetDateTime())
                .set(MINISTRIES.CREATED_BY, ministryCommand.requestedBy())
                .returning(MINISTRIES.ID)
                .fetchOne();

        if(ministriesRecord == null) throw new IllegalStateException("Ministry insert failed");

        return ministriesRecord.getId();
    }

    @Override
    public void updateMinistry(MinistryCommand ministryCommand) {
        dsl.update(MINISTRIES)
                .set(MINISTRIES.NAME, ministryCommand.name())
                .set(MINISTRIES.DESCRIPTION, ministryCommand.description())
                .set(MINISTRIES.UPDATED_AT, currentOffsetDateTime())
                .set(MINISTRIES.UPDATED_BY, ministryCommand.requestedBy())
                .where(MINISTRIES.ID.eq(ministryCommand.id()))
                .execute();
    }

    @Override
    public void deleteMinistry(MinistryCommand ministryCommand) {
        dsl.update(MINISTRIES)
                .set(MINISTRIES.DELETED_AT, currentOffsetDateTime())
                .set(MINISTRIES.DELETED_BY, ministryCommand.requestedBy())
                .where(MINISTRIES.ID.eq(ministryCommand.id()))
                .execute();
    }
}
