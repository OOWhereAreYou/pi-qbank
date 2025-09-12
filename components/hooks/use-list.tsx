"use client";
import { ServiceReturn } from "@/server/lib/error-handler";
import { useState, useEffect, useMemo } from "react";

export const PAGE_SIZE = 20;

export interface IList<T> {
  records: T[];
  total: number;
}

export interface IOption<T> {
  fetcher: (
    page: number,
    pageSize: number,
    searchTerm?: string
  ) => Promise<ServiceReturn<IList<T>>>;
  initialData?: IList<T> | null | undefined; //初始值
  options?: {
    manual?: boolean; //自动拉取
    mode?: "pagination" | "scroll";
    pageSize?: number;
    current?: number;
    searchTerm?: string;
  };
}

export const useList = <T,>({
  fetcher,
  initialData = { records: [], total: 0 },
  options,
}: IOption<T>) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(options?.searchTerm);
  const [pageSize, setPageSize] = useState(options?.pageSize ?? PAGE_SIZE);
  const [current, setCurrent] = useState(options?.current ?? 1);

  const fetch = async (p?: number, pSize?: number, term?: string | null) => {
    if (loading || (p && p < 1)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetcher(
        p ?? current,
        pSize ?? pageSize,
        term === null ? undefined : term ?? searchTerm
      );
      if (res.data) {
        setData(res.data);
        setPageSize(pSize ?? pageSize);
        setCurrent(p ?? current);
        setSearchTerm(term === null ? undefined : term ?? searchTerm);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options?.manual) {
      fetch();
    }
  }, [options?.manual]);

  const refresh = () => {
    return fetch();
  };

  const onSearch = (txt?: string | null) => {
    return fetch(undefined, undefined, txt);
  };

  const onChange = (page?: number) => {
    return fetch(page, undefined, undefined);
  };

  return {
    loading,
    data,
    run: fetch,
    refresh,
    onChange,
    pageSize,
    records: data?.records ?? [],
    total: data?.total ?? 0,
    totalPages: useMemo(
      () => Math.ceil(data?.total ?? 0 / pageSize),
      [data?.total, pageSize]
    ),
    current,
    setSearchTerm,
    searchTerm,
    onSearch,
    hasNext: useMemo(
      () => current * pageSize < (data?.total ?? 0),
      [current, pageSize, data?.total]
    ),
    hasPrev: useMemo(() => current > 1, [current]),
    onNext: () => fetch(current + 1),
    onPrev: () => fetch(current - 1),
    refetch: () => fetch(1, undefined, ""),
  };
};
