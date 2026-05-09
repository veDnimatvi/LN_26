import { useRef, useState } from 'react';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd';

const DEFAULT_PAGE_SIZE = 10;

interface DonVi {
  ma: string;
  ten: string;
  [key: string]: unknown;
}

interface ApiResponse {
  data: DonVi[];
  total: number;
}

interface LazySelectProps extends Omit<SelectProps, 'options' | 'showSearch'> {
  /** URL API để fetch dữ liệu */
  apiUrl: string;
  /** Tên param tìm kiếm, mặc định: "keysearch" */
  keySearchParam?: string;
}

async function fetchData(
  apiUrl: string,
  page: number,
  size: number,
  keysearch: string,
  keySearchParam: string,
): Promise<ApiResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  if (keysearch) params.set(keySearchParam, keysearch);

  const res = await fetch(`${apiUrl}?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export default function LazySelect({
  apiUrl,
  keySearchParam = 'keysearch',
  ...rest
}: LazySelectProps) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const keywordRef = useRef('');
  const fetchedOnce = useRef(false);
  const fetchIdRef = useRef(0);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadData = async (page: number, keyword: string, replace: boolean) => {
    const currentId = ++fetchIdRef.current;
    setLoading(true);
    try {
      const res = await fetchData(apiUrl, page, DEFAULT_PAGE_SIZE, keyword, keySearchParam);

      if (currentId !== fetchIdRef.current) return;

      const newOptions = res.data.map((item) => ({
        value: item.ma,
        label: item.ten,
      }));

      setOptions((prev) => (replace ? newOptions : [...prev, ...newOptions]));
      setHasMore(page * DEFAULT_PAGE_SIZE < res.total);
    } catch (err) {
      console.error('[LazySelect] Fetch error:', err);
    } finally {
      if (currentId === fetchIdRef.current) setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open && !fetchedOnce.current) {
      fetchedOnce.current = true;
      loadData(1, '', true);
    }
    rest.onOpenChange?.(open);
  };

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading && hasMore) {
      pageRef.current += 1;
      loadData(pageRef.current, keywordRef.current, false);
    }
    rest.onPopupScroll?.(e);
  };

  const handleSearch = (keyword: string) => {
    pageRef.current = 1;
    keywordRef.current = keyword;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      loadData(1, keyword, true);
    }, 400);
  };

  const handleClear = () => {
    pageRef.current = 1;
    keywordRef.current = '';
    loadData(1, '', true);
    rest.onClear?.();
  };

  return (
    <Select
      placeholder="Tìm kiếm..."
      {...rest}
      options={options}
      onOpenChange={handleOpenChange}
      onPopupScroll={handlePopupScroll}
      onClear={handleClear}
      showSearch={{ onSearch: handleSearch }}
      notFoundContent={loading ? <Spin size="small" /> : (rest.notFoundContent ?? 'Không có dữ liệu')}
      popupRender={(menu) => (
        <>
          {menu}
          {loading && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <Spin size="small" />
            </div>
          )}
          {!hasMore && options.length > 0 && (
            <div style={{ textAlign: 'center', padding: '8px 0', color: '#999', fontSize: 12 }}>
              Đã tải hết {options.length} kết quả
            </div>
          )}
        </>
      )}
      allowClear
    />
  );
}
