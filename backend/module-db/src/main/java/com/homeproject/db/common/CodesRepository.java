package com.homeproject.db.common;

import com.homeproject.db.common.dto.CodeProjection;

import java.util.List;

public interface CodesRepository {
    List<CodeProjection> getCodeList(int typeId);
}
