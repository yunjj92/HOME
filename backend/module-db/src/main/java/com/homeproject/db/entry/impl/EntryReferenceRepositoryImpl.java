package com.homeproject.db.entry.impl;

import com.homeproject.db.entry.EntryReferenceRepository;
import com.homeproject.db.entry.dto.SourceProjection;
import com.homeproject.db.entry.dto.ThesaurusProjection;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.homeproject.db.jooq.tables.VSources.V_SOURCES;
import static com.homeproject.db.jooq.tables.VThesauruses.V_THESAURUSES;

@Repository
@RequiredArgsConstructor
public class EntryReferenceRepositoryImpl implements EntryReferenceRepository {

    private final DSLContext dsl;

    @Override
    public List<SourceProjection> getSourceList() {
        return dsl
                .selectFrom(V_SOURCES)
                .fetchInto(SourceProjection.class);
    }

    @Override
    public List<ThesaurusProjection> getThesaurusList() {
        return dsl
                .selectFrom(V_THESAURUSES)
                .fetchInto(ThesaurusProjection.class);
    }
}
