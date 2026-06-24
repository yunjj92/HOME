package com.homeproject.db.entry;

import com.homeproject.db.entry.dto.*;

import java.util.Collection;
import java.util.List;

public interface EntriesReferenceRepository {
    Integer insertSource(SourceCommand sourceCommand);
    Integer insertTag(TagCommand tagCommand);
    List<SourceProjection> getSourceList();
    List<SourceProjection> getSourceList(Collection<String> names);
    List<TagProjection> getTagList(Collection<String> names);
    List<ThesaurusProjection> getThesaurusList();
}
