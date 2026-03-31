import type { Bank } from "../../schemas/account/bank"

type BankListProps = {
  banks: Bank[];
};

export function BankList({ banks }: BankListProps) {
  return (
    <div>
      <ul>
        {banks.map((bank) => (
          <li key={bank.id}>{bank.name}</li>
        ))}
      </ul>
    </div>
  );
}