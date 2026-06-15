package com.homeproject.business.entry;

import com.homeproject.business.entry.dto.SourceResult;
import com.homeproject.business.entry.dto.ThesaurusResult;
import com.homeproject.db.entry.EntryReferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class EntryQueryService {

    private final EntryReferenceRepository entryReferenceRepository;

    public List<SourceResult> getSourceList() {
        return entryReferenceRepository.getSourceList()
                .stream()
                .map(SourceResult::from)
                .toList();
    }

    public List<ThesaurusResult> getThesaurusList() {
        return entryReferenceRepository.getThesaurusList()
                .stream()
                .map(ThesaurusResult::from)
                .toList();
    }
}
