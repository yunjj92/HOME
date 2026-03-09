package com.homeproject.db.repository.impl;

import com.homeproject.db.jooq.tables.pojos.BanksEntity;
import com.homeproject.db.repository.MemberRepository;
import org.jooq.DSLContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jooq.JooqTest;
import org.springframework.context.annotation.Import;

import java.time.OffsetDateTime;
import java.util.Optional;

import static com.homeproject.db.jooq.tables.Banks.BANKS;
import static org.assertj.core.api.Assertions.assertThat;

@JooqTest
@Import(MemberRepositoryImpl.class)
class MemberRepositoryTest {

    @Autowired
    DSLContext dsl;

    @Autowired
    private MemberRepository memberRepository;

    @Test
    @DisplayName("회원 ID로 조회가 성공해야 한다")
    void findByIdTest() {
        int banksId = 1234;
        dsl.insertInto(BANKS).set(BANKS.ID, banksId)
                .set(BANKS.NAME, "테스터")
                .set(BANKS.CREATED_AT, OffsetDateTime.now())
                .set(BANKS.CREATED_BY, "TEST").execute();

        Optional<BanksEntity> result = Optional.ofNullable(memberRepository.findById(banksId));

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("테스터");


    }



}
