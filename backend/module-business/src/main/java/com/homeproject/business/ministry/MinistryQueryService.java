package com.homeproject.business.ministry;

import com.homeproject.business.ministry.dto.MinistryResult;
import com.homeproject.db.ministry.MinistriesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class MinistryQueryService {

    private final MinistriesRepository ministriesRepository;

    public List<MinistryResult> getMinistryList() {
        return ministriesRepository.getMinistryList()
                .stream()
                .map(MinistryResult::from)
                .toList();
    }
}
