import { useState, useEffect, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { requestBackend } from "utils/requests";

type UseFetchDataProps<T> = {
  url: string;
  initialData?: T[] | null; // Dados iniciais opcionais
};

export function useFetchData<T>({ url, initialData = [] }: UseFetchDataProps<T>) {
  const [data, setData] = useState<T[]>(initialData ? initialData : []);
  const [loading, setLoading] = useState<boolean>(initialData && initialData.length === 0 ? true : false);

  const loadData = useCallback(() => {
    if (initialData && initialData.length > 0) {
      setTimeout(() => {
        setData(initialData);
      }, 300);
      setLoading(false);
    } else {
      setLoading(true);

      const requestParams: AxiosRequestConfig = {
        url,
        method: "GET",
        withCredentials: true,
      };

      requestBackend(requestParams)
        .then((res) => {
          setTimeout(() => {
            setData(res.data as T[]);
          }, 300);
        })
        .catch(() => {
          toast.error(`Erro ao carregar dados de ${url}.`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [url, initialData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading };
}
