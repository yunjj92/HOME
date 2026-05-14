package com.homeproject.db.ministry;

import com.homeproject.db.ministry.dto.MinistryCommand;
import com.homeproject.db.ministry.dto.MinistryProjection;

import java.util.List;

public interface MinistriesRepository {
    List<MinistryProjection> getMinistryList();
    Integer insertMinistry(MinistryCommand ministryCommand);
    void updateMinistry(MinistryCommand ministryCommand);
    void deleteMinistry(MinistryCommand ministryCommand);
}
