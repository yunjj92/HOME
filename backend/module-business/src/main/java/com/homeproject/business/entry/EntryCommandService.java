package com.homeproject.business.entry;

import com.homeproject.business.entry.dto.EntryParam;
import com.homeproject.business.entry.dto.SourceParam;
import com.homeproject.business.entry.dto.TagParam;
import com.homeproject.db.entry.EntriesRepository;
import com.homeproject.db.entry.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EntryCommandService {

    private final EntriesRepository entriesRepository;

    private SourceCommand toSourceCommand(SourceParam sourceParam) {
        return new SourceCommand(
                sourceParam.id(),
                sourceParam.name(),
                sourceParam.description(),
                sourceParam.requestedBy()
        );
    }

    private TagCommand toTagCommand(TagParam tagParam) {
        return new TagCommand(
                tagParam.id(),
                tagParam.name(),
                tagParam.requestedBy()
        );
    }

    private EntryCommand toEntryCommand(EntryParam entryParam) {
        return new EntryCommand(
                entryParam.id(),
                entryParam.accountId(),
                entryParam.date(),
                entryParam.amount(),
                entryParam.memo(),
                entryParam.requestedBy()
        );
    }

    private IncomeCommand toIncomeCommand(EntryParam entryParam, Integer entryId, Map<Integer, Integer> sourcesMap) {

        // entryParam에 id값이 존재한다면, 수정 -> 기존 id 값 사용
        if(entryParam.id() != null) entryId = entryParam.id();

        // entryParam의 sourceId 값이 음수라면 신규 수입처 -> 신규 id 값 사용
        Integer sourceId = entryParam.sourceId();
        if(sourceId < 0) sourceId = sourcesMap.get(sourceId);

        return new IncomeCommand(
                entryId,
                sourceId,
                entryParam.requestedBy()
        );
    }

    private ExpenseCommand toExpenseCommand(EntryParam entryParam, Integer entryId, Map<Integer, Integer> tagMap) {

        if(entryParam.id() != null) entryId = entryParam.id();

        Integer tagId = entryParam.tagId();
        if(tagId != null && tagId < 0) tagId = tagMap.get(tagId);

        return new ExpenseCommand(
                entryId,
                entryParam.merchant(),
                entryParam.ministryId(),
                tagId,
                entryParam.requestedBy()
        );
    }

    @Transactional
    public void saveEntries(
            List<EntryParam> entryParams,
            List<SourceParam> sourceParams,
            List<TagParam> tagParams
    ) {
        Map<Integer, Integer> sourcesMap = new HashMap<>();
        Map<Integer, Integer> tagsMap = new HashMap<>();
        if(sourceParams != null && !sourceParams.isEmpty()) sourcesMap = insertNewSources(sourceParams);
        if(tagParams != null && !tagParams.isEmpty()) tagsMap = insertNewTags(tagParams);

        for(EntryParam entryParam : entryParams) {
            EntryCommand entryCommand = toEntryCommand(entryParam);

            if(entryParam.entryType().equals("income")) {
                // 수입
                if(entryParam.id() == null) {
                    int entryId = entriesRepository.insertEntry(entryCommand);
                    entriesRepository.insertIncome(toIncomeCommand(entryParam, entryId, sourcesMap));
                }
                /*else if(entryParam.toDelete()) {

                } else {

                }*/
            } else {
                // 지출
                if(entryParam.id() == null) {
                    int entryId = entriesRepository.insertEntry(entryCommand);
                    entriesRepository.insertExpense(toExpenseCommand(entryParam, entryId, tagsMap));
                }
                /*else if(entryParam.toDelete()) {

                } else {

                }*/
            }
        }
    }

    public Map<Integer, Integer> insertNewSources(List<SourceParam> sourceParams) {
        Map<Integer, Integer> sourcesMap = new HashMap<>();
        for(SourceParam sourceParam : sourceParams) {
            int sourceId = entriesRepository.insertSource(toSourceCommand(sourceParam));
            sourcesMap.put(sourceParam.clientKey(), sourceId);
        }
        return sourcesMap;
    }

    public Map<Integer, Integer> insertNewTags(List<TagParam> tagParams) {
        Map<Integer, Integer> tagsMap = new HashMap<>();
        for(TagParam tagParam : tagParams) {
            int tagId = entriesRepository.insertTag(toTagCommand(tagParam));
            tagsMap.put(tagParam.clientKey(), tagId);
        }
        return tagsMap;
    }
}
