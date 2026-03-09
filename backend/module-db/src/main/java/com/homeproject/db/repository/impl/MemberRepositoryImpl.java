package com.homeproject.db.repository.impl;


import com.homeproject.db.jooq.tables.pojos.BanksEntity;
import com.homeproject.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import static com.homeproject.db.jooq.tables.Banks.BANKS;

@Repository
@RequiredArgsConstructor
public class MemberRepositoryImpl implements MemberRepository {

    private final DSLContext dsl;


    @Override
    public BanksEntity findById(int id) {
        return dsl.selectFrom(BANKS).where(BANKS.ID.eq(id)).fetchOneInto(BanksEntity.class);
    }

    @Override
    public void save(BanksEntity banksEntity) {
        dsl.insertInto(BANKS).set(dsl.newRecord()).execute();
    }
}
