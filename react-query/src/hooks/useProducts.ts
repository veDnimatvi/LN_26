import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService'

export const productKeys = {
  all: ['products'] as const,
  list: (limit: number, skip: number) => ['products', 'list', { limit, skip }] as const,
  detail: (id: number) => ['products', 'detail', id] as const,
}

export function useProducts(limit = 10, skip = 0) {
  return useQuery({
    queryKey: productKeys.list(limit, skip),
    queryFn: () => productService.getProducts(limit, skip),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: id > 0,
  })
}
