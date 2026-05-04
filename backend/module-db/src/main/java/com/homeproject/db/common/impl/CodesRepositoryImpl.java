package com.homeproject.db.common.impl;

import com.homeproject.db.common.CodesRepository;
import com.homeproject.db.common.dto.CodeProjection;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.homeproject.db.jooq.tables.VCodes.V_CODES;

@Repository
@RequiredArgsConstructor
public class CodesRepositoryImpl implements CodesRepository {

    private final DSLContext dsl;

    @Override
    public List<CodeProjection> getCodeList(int typeId) {
        return dsl
                .selectFrom(V_CODES)
                .where(V_CODES.TYPE_ID.eq(typeId))
                .fetchInto(CodeProjection.class);
    }
}
