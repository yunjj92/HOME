package com.homeproject.db.config.impl;

import com.homeproject.db.config.ConfigRepository;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import static com.homeproject.db.jooq.Tables.CONFIGS;

@Repository
@RequiredArgsConstructor
public class ConfigRepositoryImpl implements ConfigRepository {

    private final DSLContext dsl;

    @Override
    public String getValue(String name) {
        return dsl.select(CONFIGS.VALUE)
                .from(CONFIGS)
                .where(CONFIGS.NAME.eq(name))
                .and(CONFIGS.DELETED_AT.isNull())
                .fetchOneInto(String.class);
    }

    @Override
    public void setValue(String name, String value) {
        boolean exists = dsl.fetchExists(
                dsl.selectFrom(CONFIGS)
                        .where(CONFIGS.NAME.eq(name))
                        .and(CONFIGS.DELETED_AT.isNull())
        );

        if (exists) {
            dsl.update(CONFIGS)
                    .set(CONFIGS.VALUE, value)
                    .set(CONFIGS.UPDATED_AT, java.time.LocalDateTime.now())
                    .where(CONFIGS.NAME.eq(name))
                    .execute();
        } else {
            dsl.insertInto(CONFIGS)
                    .set(CONFIGS.NAME, name)
                    .set(CONFIGS.VALUE, value)
                    .set(CONFIGS.CREATED_AT, java.time.LocalDateTime.now())
                    .execute();
        }
    }
}
