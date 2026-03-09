package com.homeproject.db.repository;

import com.homeproject.db.jooq.tables.pojos.BanksEntity;

import java.util.List;

public interface MemberRepositoryTest{

    List<BanksEntity> findAll();

    void save(BanksEntity banksEntity);

}
