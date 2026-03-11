package com.homeproject.business.healthcheck;

import com.homeproject.db.jooq.tables.pojos.BanksEntity;
import com.homeproject.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class MemberReadService {

    private final MemberRepository memberRepository;

    public boolean saveReadFirst(int id){
        memberRepository.save(new BanksEntity().setId(id).setName("테스트명").setCreatedAt(OffsetDateTime.now()).setCreatedBy("admin"));
        return true;
    }

}
