package com.homeproject.db.repository.impl;

import com.homeproject.db.repository.MemberRepositoryTest;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jooq.JooqTest;
import org.springframework.context.annotation.Import;

@JooqTest
@Import(MemberRepositoryTest.class)
public class MemberRepositoryTestImpl {

    @Autowired
    private DSLContext dslContext;

}
