package com.homeproject.business.common;

import com.homeproject.business.common.dto.CodeResult;
import com.homeproject.business.common.dto.TypeResult;
import com.homeproject.db.common.CodesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class CommonQueryService {

    private final CodesRepository codesRepository;

    public List<CodeResult> getCodeList(Integer typeId) {
        return (typeId == null
                ? codesRepository.getCodeList()
                : codesRepository.getCodeList(typeId))
                .stream()
                .map(CodeResult::from)
                .toList();
    }

    public List<TypeResult> getTypeList() {
        return codesRepository.getTypeList()
                .stream()
                .map(TypeResult::from)
                .toList();
    }
}
