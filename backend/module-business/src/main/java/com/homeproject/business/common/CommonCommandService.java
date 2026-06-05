package com.homeproject.business.common;

import com.homeproject.business.common.dto.CodeParam;
import com.homeproject.business.common.dto.TypeParam;
import com.homeproject.db.common.CodesRepository;
import com.homeproject.db.common.dto.CodeCommand;
import com.homeproject.db.common.dto.TypeCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommonCommandService {
    private final CodesRepository codesRepository;

    private CodeCommand toCodeCommand(CodeParam codeParam) {
        return new CodeCommand(
                codeParam.id(),
                codeParam.typeId(),
                codeParam.code(),
                codeParam.name(),
                codeParam.description(),
                codeParam.requestedBy()
        );
    }

    private TypeCommand toTypeCommand(TypeParam typeParam) {
        return new TypeCommand(
                typeParam.id(),
                typeParam.name(),
                typeParam.description(),
                typeParam.requestedBy()
        );
    }

    @Transactional
    public void saveCodes(List<CodeParam> codeParams) {
        for(CodeParam codeParam : codeParams) {
            CodeCommand codeCommand = toCodeCommand(codeParam);

            if(codeParam.id() == null) {
                codesRepository.insertCode(codeCommand);
            } else if(codeParam.toDelete()) {
                codesRepository.deleteCode(codeCommand);
            } else {
                codesRepository.updateCode(codeCommand);
            }
        }
    }

    @Transactional
    public void saveTypes(List<TypeParam> typeParams) {
        for(TypeParam typeParam : typeParams) {
            TypeCommand typeCommand = toTypeCommand(typeParam);

            if(typeParam.id() == null) {
                codesRepository.insertType(typeCommand);
            } else if(typeParam.toDelete()) {
                codesRepository.deleteType(typeCommand);
            } else {
                codesRepository.updateType(typeCommand);
            }
        }
    }
}
