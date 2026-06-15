package com.homeproject.db.entry;

import com.homeproject.db.entry.dto.*;

import java.util.List;

public interface EntryReferenceRepository {
    List<SourceProjection> getSourceList();
    List<ThesaurusProjection> getThesaurusList();
}
