import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'

const LIMIT = 10

export default function ProductList() {
  const [page, setPage] = useState(0)
  const skip = page * LIMIT

  const { data, isLoading, isError, error, isFetching } = useProducts(LIMIT, skip)

  if (isLoading) return <p className="status">Đang tải sản phẩm...</p>
  if (isError) return <p className="status error">Lỗi: {(error as Error).message}</p>

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0

  return (
    <div className="product-page">
      <h1>
        Danh sách sản phẩm
        {isFetching && <span className="fetching"> (đang cập nhật...)</span>}
      </h1>

      <div className="product-grid">
        {data?.products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.thumbnail} alt={product.title} />
            <div className="product-info">
              <h3>{product.title}</h3>
              <p className="category">{product.category}</p>
              <p className="description">{product.description}</p>
              <div className="product-footer">
                <span className="price">${product.price}</span>
                <span className="rating">⭐ {product.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
          ← Trước
        </button>
        <span>
          Trang {page + 1} / {totalPages}
        </span>
        <button onClick={() => setPage((p) => p + 1)} disabled={page + 1 >= totalPages}>
          Tiếp →
        </button>
      </div>
    </div>
  )
}
