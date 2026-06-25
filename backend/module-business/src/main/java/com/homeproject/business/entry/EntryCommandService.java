package com.homeproject.business.entry;

import com.homeproject.business.entry.dto.EntryParam;
import com.homeproject.db.entry.EntriesReferenceRepository;
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
    private final EntriesReferenceRepository entriesReferenceRepository;

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

    @Transactional
    public void saveEntries(List<EntryParam> entryParams, String requestedBy) {
        // 수입원Map 생성
        Map<String, Integer> sourcesMap = new HashMap<>();
        entryParams.stream()
                .filter(entry -> "inc".equals(entry.entryType()))
                .map(EntryParam::connection)
                .filter(source -> source != null && !source.isEmpty())
                .distinct()
                .forEach(source -> sourcesMap.put(source, null));

        entriesReferenceRepository.getSourceList(sourcesMap.keySet())
                .forEach(source -> sourcesMap.put(source.name(), source.id()));

        for(Map.Entry<String, Integer> sourceEntry : sourcesMap.entrySet()) {
            if(sourceEntry.getValue() != null) continue;

            Integer sourceId = entriesReferenceRepository.insertSource(new SourceCommand(
                    null,
                    sourceEntry.getKey(),
                    null,
                    requestedBy
            ));
            sourceEntry.setValue(sourceId);
        }

        // 태그Map 생성
        Map<String, Integer> tagsMap = new HashMap<>();
        entryParams.stream()
                .filter(entry -> "exp".equals(entry.entryType()))
                .map(EntryParam::tagName)
                .filter(tag -> tag != null && !tag.isEmpty())
                .distinct()
                .forEach(tag -> tagsMap.put(tag, null));

        entriesReferenceRepository.getTagList(tagsMap.keySet())
                .forEach(tag -> tagsMap.put(tag.name(), tag.id()));

        for(Map.Entry<String, Integer> tagEntry : tagsMap.entrySet()) {
            if(tagEntry.getValue() != null) continue;

            Integer tagId = entriesReferenceRepository.insertTag(new TagCommand(
                    null,
                    tagEntry.getKey(),
                    requestedBy
            ));
            tagEntry.setValue(tagId);
        }

        // 행별로 처리
        for(EntryParam entryParam : entryParams) {
            EntryCommand entryCommand = toEntryCommand(entryParam);

            // 수입
            if("inc".equals(entryParam.entryType())) {
                if(entryParam.id() == null) {
                    int entryId = entriesRepository.insertEntry(entryCommand);
                    entriesRepository.insertIncome(new IncomeCommand(
                            entryId,
                            sourcesMap.get(entryParam.connection()),
                            requestedBy
                    ));
                }
                /*else if(entryParam.toDelete()) {

                } else {

                }*/
            // 지출
            } else if("exp".equals(entryParam.entryType())) {
                if (entryParam.ministryId() == null) {
                    throw new IllegalArgumentException("ministryId is required for expense.");
                }

                if(entryParam.id() == null) {
                    int entryId = entriesRepository.insertEntry(entryCommand);
                    entriesRepository.insertExpense(new ExpenseCommand(
                            entryId,
                            entryParam.connection(),
                            entryParam.ministryId(),
                            tagsMap.get(entryParam.tagName()),
                            requestedBy
                    ));
                }
                /*else if(entryParam.toDelete()) {

                } else {

                }*/
            } else {
                throw new IllegalArgumentException("Invalid entryType: " + entryParam.entryType());
            }
        }
    }
}
