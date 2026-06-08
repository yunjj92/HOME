package com.homeproject.db.common;

import com.homeproject.db.common.dto.CodeCommand;
import com.homeproject.db.common.dto.CodeProjection;
import com.homeproject.db.common.dto.TypeCommand;
import com.homeproject.db.common.dto.TypeProjection;

import java.util.List;

public interface CodesRepository {
    List<CodeProjection> getCodeList(int typeId);
    List<CodeProjection> getCodeList();
    List<TypeProjection> getTypeList();
    Integer insertCode(CodeCommand codeCommand);
    void updateCode(CodeCommand codeCommand);
    void deleteCode(CodeCommand codeCommand);
    Integer insertType(TypeCommand typeCommand);
    void updateType(TypeCommand typeCommand);
    void deleteType(TypeCommand typeCommand);
}
