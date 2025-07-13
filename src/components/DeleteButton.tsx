//src/components/DeleteButton.tsx
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

type DeleteButtonProps = {
  id: number;
  onDelete: (id: number) => Promise<void>;
  label?: string;
  className?: string;
};

export default function DeleteButton({
  id,
  onDelete,
  label = '削除',
  className = 'flex-shrink-0 w-20 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded shadow',
}: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await onDelete(id);
      router.refresh();
    });
  };

  return (
    <button onClick={handleDelete} disabled={isPending} className={className}>
      {isPending ? `${label}中...` : label}
    </button>
  );
}
