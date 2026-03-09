package com.homeproject.db.repository;

import com.homeproject.db.jooq.tables.pojos.BanksEntity;

public interface MemberRepository {

    BanksEntity findById(int id);

    void save(BanksEntity banksEntity);

}
