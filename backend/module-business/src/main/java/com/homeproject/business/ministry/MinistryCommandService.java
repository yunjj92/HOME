package com.homeproject.business.ministry;

import com.homeproject.business.ministry.dto.MinistryParam;
import com.homeproject.db.ministry.MinistriesRepository;
import com.homeproject.db.ministry.dto.MinistryCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MinistryCommandService {
    private final MinistriesRepository ministriesRepository;

    private MinistryCommand toMinistryCommand(MinistryParam ministryParam) {
        return new MinistryCommand(
                ministryParam.id(),
                ministryParam.name(),
                ministryParam.description(),
                ministryParam.requestedBy()
        );
    }

    @Transactional
    public void saveMinistries(List<MinistryParam> ministryParams) {
        for(MinistryParam ministryParam : ministryParams) {
            MinistryCommand ministryCommand = toMinistryCommand(ministryParam);

            if(ministryParam.id() == null) {
                ministriesRepository.insertMinistry(ministryCommand);
            } else if(ministryParam.toDelete()) {
                ministriesRepository.deleteMinistry(ministryCommand);
            } else {
                ministriesRepository.updateMinistry(ministryCommand);
            }
        }
    }
}
