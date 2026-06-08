package com.homeproject.db.common.impl;

import com.homeproject.db.common.CodesRepository;
import com.homeproject.db.common.dto.CodeCommand;
import com.homeproject.db.common.dto.CodeProjection;
import com.homeproject.db.common.dto.TypeCommand;
import com.homeproject.db.common.dto.TypeProjection;
import com.homeproject.db.jooq.tables.records.CodesRecord;
import com.homeproject.db.jooq.tables.records.TypesRecord;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.homeproject.db.jooq.Tables.CODES;
import static com.homeproject.db.jooq.Tables.TYPES;
import static com.homeproject.db.jooq.tables.VCodes.V_CODES;
import static com.homeproject.db.jooq.tables.VTypes.V_TYPES;
import static org.jooq.impl.DSL.currentOffsetDateTime;

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

    @Override
    public List<CodeProjection> getCodeList() {
        return dsl
                .selectFrom(V_CODES)
                .fetchInto(CodeProjection.class);
    }

    @Override
    public List<TypeProjection> getTypeList() {
        return dsl
                .selectFrom(V_TYPES)
                .fetchInto(TypeProjection.class);
    }

    @Override
    public Integer insertCode(CodeCommand codeCommand) {
        CodesRecord codesRecord = dsl.insertInto(CODES)
                .set(CODES.TYPE_ID, codeCommand.typeId())
                .set(CODES.CODE, codeCommand.code())
                .set(CODES.NAME, codeCommand.name())
                .set(CODES.DESCRIPTION, codeCommand.description())
                .set(CODES.CREATED_AT, currentOffsetDateTime())
                .set(CODES.CREATED_BY, codeCommand.requestedBy())
                .returning(CODES.ID)
                .fetchOne();

        if(codesRecord == null) throw new IllegalStateException("Code insert failed");

        return codesRecord.getId();
    }

    @Override
    public void updateCode(CodeCommand codeCommand) {
        dsl.update(CODES)
            .set(CODES.TYPE_ID, codeCommand.typeId())
            .set(CODES.CODE, codeCommand.code())
            .set(CODES.NAME, codeCommand.name())
            .set(CODES.DESCRIPTION, codeCommand.description())
            .set(CODES.UPDATED_AT, currentOffsetDateTime())
            .set(CODES.UPDATED_BY, codeCommand.requestedBy())
            .where(CODES.ID.eq(codeCommand.id()))
            .execute();
    }

    @Override
    public void deleteCode(CodeCommand codeCommand) {
        dsl.update(CODES)
            .set(CODES.DELETED_AT, currentOffsetDateTime())
            .set(CODES.DELETED_BY, codeCommand.requestedBy())
            .where(CODES.ID.eq(codeCommand.id()))
            .execute();
    }

    @Override
    public Integer insertType(TypeCommand typeCommand) {
        TypesRecord typesRecord = dsl.insertInto(TYPES)
                .set(TYPES.NAME, typeCommand.name())
                .set(TYPES.DESCRIPTION, typeCommand.description())
                .set(TYPES.CREATED_AT, currentOffsetDateTime())
                .set(TYPES.CREATED_BY, typeCommand.requestedBy())
                .returning(TYPES.ID)
                .fetchOne();

        if(typesRecord == null) throw new IllegalStateException("Type insert failed");

        return typesRecord.getId();
    }

    @Override
    public void updateType(TypeCommand typeCommand) {
        dsl.update(TYPES)
            .set(TYPES.NAME, typeCommand.name())
            .set(TYPES.DESCRIPTION, typeCommand.description())
            .set(TYPES.UPDATED_AT, currentOffsetDateTime())
            .set(TYPES.UPDATED_BY, typeCommand.requestedBy())
            .where(TYPES.ID.eq(typeCommand.id()))
            .execute();
    }

    @Override
    public void deleteType(TypeCommand typeCommand) {
        dsl.update(TYPES)
            .set(TYPES.DELETED_AT, currentOffsetDateTime())
            .set(TYPES.DELETED_BY, typeCommand.requestedBy())
            .where(TYPES.ID.eq(typeCommand.id()))
            .execute();
    }
}
