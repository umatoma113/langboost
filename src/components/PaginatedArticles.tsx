'use client';

import Pagination from '@/components/UI/Pagination';

type Props = {
  page: number;
  totalPages: number;
  query?: string;
};

export default function PaginationWrapper({ page, totalPages, query }: Props) {
  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(newPage));
    if (query) url.searchParams.set('q', query);
    window.location.href = url.toString();
  };

  return (
    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
  );
}
