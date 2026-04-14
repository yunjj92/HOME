package com.homeproject.db.accounts.impl;

import com.homeproject.db.DbTestApplication;
import com.homeproject.db.accounts.AccountsRepository;
import com.homeproject.db.accounts.dto.AccountCommand;
import com.homeproject.db.accounts.dto.AccountProjection;
import com.homeproject.db.accounts.dto.BankCommand;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = DbTestApplication.class)
@Transactional
class AccountsRepositoryImplTest {

    @Autowired
    private AccountsRepository accountsRepository;

    @Test
    @DisplayName("계좌 등록 → 조회 → 수정 → 조회 → 삭제 → 조회 제외 흐름 테스트")
    void accountFlowTest() {

        // 1. bank insert
        Integer bankId = accountsRepository.insertBank(
                new BankCommand(
                        null,
                        "테스트은행",
                        "tester"
                )
        );

        assertThat(bankId).isNotNull();

        // 2. account insert
        Integer accountId = accountsRepository.insertAccount(
                new AccountCommand(
                        null,
                        bankId,
                        "bdg",
                        "테스트계좌",
                        "ME",
                        "krw",
                        "123-456",
                        "초기 설명",
                        "tester"
                )
        );

        assertThat(accountId).isNotNull();

        // 3. 조회
        List<AccountProjection> insertedList = accountsRepository.getAccountList();

        AccountProjection inserted = insertedList.stream()
                .filter(a -> a.id().equals(accountId))
                .findFirst()
                .orElseThrow();

        assertThat(inserted.bankId()).isEqualTo(bankId);
        assertThat(inserted.name()).isEqualTo("테스트계좌");
        assertThat(inserted.accountNumber()).isEqualTo("123-456");
        assertThat(inserted.description()).isEqualTo("초기 설명");

        // 4. update
        accountsRepository.updateAccount(
                new AccountCommand(
                        accountId,
                        bankId,
                        "bdg",
                        "수정계좌",
                        "ME",
                        "krw",
                        "999-888",
                        "수정 설명",
                        "tester"
                )
        );

        // 5. 재조회
        List<AccountProjection> updatedList = accountsRepository.getAccountList();

        AccountProjection updated = updatedList.stream()
                .filter(a -> a.id().equals(accountId))
                .findFirst()
                .orElseThrow();

        assertThat(updated.name()).isEqualTo("수정계좌");
        assertThat(updated.accountNumber()).isEqualTo("999-888");
        assertThat(updated.description()).isEqualTo("수정 설명");

        // 6. delete
        accountsRepository.deleteAccount(
                new AccountCommand(
                        accountId,
                        bankId,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        "tester"
                )
        );

        // 7. 최종 조회 (삭제된 데이터 안 보여야 함)
        List<AccountProjection> deletedList = accountsRepository.getAccountList();

        boolean exists = deletedList.stream()
                .anyMatch(a -> a.id().equals(accountId));

        assertThat(exists).isFalse();
    }
}
