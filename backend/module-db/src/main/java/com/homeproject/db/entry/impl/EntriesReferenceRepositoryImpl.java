package com.homeproject.db.entry.impl;

import com.homeproject.db.entry.EntriesReferenceRepository;
import com.homeproject.db.entry.dto.*;
import com.homeproject.db.jooq.tables.records.SourcesRecord;
import com.homeproject.db.jooq.tables.records.TagsRecord;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import static com.homeproject.db.jooq.Tables.*;
import static com.homeproject.db.jooq.tables.VSources.V_SOURCES;
import static com.homeproject.db.jooq.tables.VThesauruses.V_THESAURUSES;

@Repository
@RequiredArgsConstructor
public class EntriesReferenceRepositoryImpl implements EntriesReferenceRepository {

    private final DSLContext dsl;

    @Override
    public Integer insertSource(SourceCommand sourceCommand) {
        SourcesRecord sourcesRecord = dsl.insertInto(SOURCES)
                .set(SOURCES.NAME, sourceCommand.name())
                .set(SOURCES.DESCRIPTION, sourceCommand.description())
                .set(SOURCES.CREATED_BY, sourceCommand.requestedBy())
                .returning(SOURCES.ID)
                .fetchOne();

        if(sourcesRecord == null) throw new IllegalStateException("Source insert failed");

        return sourcesRecord.getId();
    }

    @Override
    public Integer insertTag(TagCommand tagCommand) {
        TagsRecord tagsRecord = dsl.insertInto(TAGS)
                .set(TAGS.NAME, tagCommand.name())
                .set(TAGS.CREATED_BY, tagCommand.requestedBy())
                .returning(TAGS.ID)
                .fetchOne();

        if(tagsRecord == null) throw new IllegalStateException("Tag insert failed");

        return tagsRecord.getId();
    }

    @Override
    public void upsertThesaurus(ThesaurusCommand thesaurusCommand) {
        dsl.insertInto(THESAURUSES)
                .set(THESAURUSES.ACCOUNT_ID, thesaurusCommand.accountId())
                .set(THESAURUSES.MERCHANT, thesaurusCommand.merchant())
                .set(THESAURUSES.MINISTRY_ID, thesaurusCommand.ministryId())
                .set(THESAURUSES.TAG_ID, thesaurusCommand.tagId())
                .set(THESAURUSES.CREATED_BY, thesaurusCommand.requestedBy())
                .onConflict(THESAURUSES.ACCOUNT_ID, THESAURUSES.MERCHANT)
                .where(THESAURUSES.DELETED_AT.isNull())
                .doUpdate()
                .set(THESAURUSES.MINISTRY_ID, thesaurusCommand.ministryId())
                .set(THESAURUSES.TAG_ID, thesaurusCommand.tagId())
                .set(THESAURUSES.UPDATED_BY, thesaurusCommand.requestedBy())
                .set(THESAURUSES.UPDATED_AT, LocalDateTime.now())
                .execute();
    }

    @Override
    public List<SourceProjection> getSourceList() {
        return dsl
                .selectFrom(V_SOURCES)
                .fetchInto(SourceProjection.class);
    }

    @Override
    public List<SourceProjection> getSourceList(Collection<String> names) {
        if(names == null || names.isEmpty()) return List.of();

        return dsl
                .selectFrom(V_SOURCES)
                .where(V_SOURCES.NAME.in(names))
                .fetchInto(SourceProjection.class);
    }

    @Override
    public List<TagProjection> getTagList(Collection<String> names) {
        if(names == null || names.isEmpty()) return List.of();

        return dsl
                .selectFrom(V_TAGS)
                .where(V_TAGS.NAME.in(names))
                .fetchInto(TagProjection.class);
    }

    @Override
    public List<ThesaurusProjection> getThesaurusList() {
        return dsl
                .selectFrom(V_THESAURUSES)
                .fetchInto(ThesaurusProjection.class);
    }
}
