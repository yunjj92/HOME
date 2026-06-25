# 수입/지출 데이터 입력 API 규칙

## 목적

수입/지출 로우데이터 입력 기능의 API 요청/응답 규칙을 정의한다.
프론트엔드는 입력대기목록의 rows를 한 번에 전송하고, 백엔드는 하나의 트랜잭션 안에서 수입/지출 거래를 저장한다.

## 기본 원칙

- 수입과 지출 입력은 하나의 API로 처리한다.
- API 요청 데이터 구조는 controller DTO를 기준으로 정의한다.
- 요청에는 거래 입력 rows와 신규 생성이 필요한 `sources`, `tags` 정보를 함께 포함한다.
- 저장은 일괄 처리한다.
- 하나라도 실패하면 전체 저장을 롤백한다.
- repository 단에서는 생성된 id를 반환할 수 있지만, 생성 id 목록은 service 내부 처리에만 사용한다.
- 저장 성공 응답에는 생성 id 목록을 노출하지 않는다.

## 권장 엔드포인트

```http
POST /api/entries/input
```

엔드포인트명은 구현 단계에서 프로젝트의 controller naming 규칙에 맞게 조정할 수 있다.

## 요청 구조

요청은 다음 세 영역으로 구성한다.

```txt
newSources
newTags
entries
```

예시:

```json
{
  "newSources": [
    {
      "clientKey": "source-1",
      "name": "홍길동",
      "description": "신규 입금자"
    }
  ],
  "newTags": [
    {
      "clientKey": "tag-1",
      "name": "식비"
    }
  ],
  "entries": [
    {
      "rowKey": "row-1",
      "entryType": "inc",
      "accountId": 1,
      "date": "2026-06-08",
      "amount": 100000,
      "memo": "입금",
      "sourceId": null,
      "sourceClientKey": "source-1"
    },
    {
      "rowKey": "row-2",
      "entryType": "exp",
      "accountId": 1,
      "date": "2026-06-08",
      "amount": 12000,
      "memo": "점심",
      "merchant": "식당",
      "ministryId": 3,
      "tagId": null,
      "tagClientKey": "tag-1"
    }
  ]
}
```

## Draft Key 규칙

신규 `sources`, `tags`는 아직 DB id가 없으므로 프론트엔드에서 생성한 draft key를 사용한다. 
draft key는 음수로만 사용한다.

- 신규 source는 `newSources[].clientKey`로 식별한다.
- 신규 tag는 `newTags[].clientKey`로 식별한다.
- 수입 row가 신규 source를 참조할 때는 `sourceClientKey`를 사용한다.
- 지출 row가 신규 tag를 참조할 때는 `tagClientKey`를 사용한다.
- 기존 source를 참조할 때는 `sourceId`를 사용한다.
- 기존 tag를 참조할 때는 `tagId`를 사용한다.
- 하나의 row에서 `sourceId`와 `sourceClientKey`를 동시에 사용하지 않는다.
- 하나의 row에서 `tagId`와 `tagClientKey`를 동시에 사용하지 않는다.

백엔드 service는 신규 master 데이터를 먼저 저장한 뒤 다음 매핑을 생성한다.

```txt
sourceClientKey -> sourceId
tagClientKey -> tagId
```

이후 각 거래 row에 생성된 id를 반영하여 `entries`, `incomes`, `expenses`를 저장한다.

## Entry Row 필드

공통 필드:

```txt
rowKey
entryType
accountId
date
amount
memo
```

수입 필드:

```txt
sourceId
sourceClientKey
```

지출 필드:

```txt
merchant
ministryId
tagId
tagClientKey
```

## 저장 처리 순서

백엔드 service는 다음 순서로 처리한다.

```txt
1. 요청 DTO validation
2. 신규 sources 저장
3. 신규 tags 저장
4. sourceClientKey, tagClientKey 매핑 생성
5. entries 저장
6. entryType에 따라 incomes 또는 expenses 저장
7. 전체 성공 시 commit
8. 하나라도 실패 시 rollback
```

## Validation 규칙

공통:

- `rowKey`는 필수이다.
- `entryType`은 `inc` 또는 `exp`만 허용한다.
- `accountId`는 필수이다.
- `date`는 필수이다.
- `amount`는 필수이다.
- `amount`는 0 이상의 정수여야 한다.
- `memo`는 선택값이다.

수입:

- `sourceId` 또는 `sourceClientKey` 중 하나는 필수이다.
- `sourceId`와 `sourceClientKey`를 동시에 보낼 수 없다.

지출:

- `merchant`는 필수이다.
- `ministryId`는 필수이다.
- `tagId`와 `tagClientKey`는 선택값이다.
- `tagId`와 `tagClientKey`를 동시에 보낼 수 없다.

## 에러 응답 구조

백엔드에서 발생한 validation error와 처리 error는 가능한 한 row 단위로 기록하여 프론트엔드에 반환한다.

권장 구조:

```json
{
  "success": false,
  "message": "거래 입력에 실패했습니다.",
  "errors": [
    {
      "rowKey": "row-3",
      "field": "amount",
      "message": "금액은 0 이상의 정수여야 합니다."
    },
    {
      "rowKey": "row-5",
      "field": "sourceId",
      "message": "수입은 수입원이 필수입니다."
    }
  ]
}
```

특정 row 또는 field에 귀속하기 어려운 에러는 `rowKey`, `field`를 비워서 반환할 수 있다.

```json
{
  "rowKey": null,
  "field": null,
  "message": "중복 거래가 존재합니다."
}
```

## 성공 응답 구조

저장 성공 시 생성 id 목록은 반환하지 않는다.

권장 구조:

```json
{
  "success": true,
  "message": "저장되었습니다.",
  "data": null
}
```

## 트랜잭션 규칙

- 입력대기목록 전체를 하나의 트랜잭션으로 저장한다.
- 신규 `sources`, `tags`, `entries`, `incomes`, `expenses` 저장 중 하나라도 실패하면 전체 롤백한다.
- 롤백 시 프론트엔드는 입력대기목록을 유지하고, 응답으로 받은 에러 정보를 각 row 또는 cell에 표시한다.
