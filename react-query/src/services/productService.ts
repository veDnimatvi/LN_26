import type { ProductsResponse, Product } from '../types/product'

const BASE_URL = 'https://dummyjson.com'

export const productService = {
  getProducts: async (limit = 10, skip = 0): Promise<ProductsResponse> => {
    const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`)
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
  },

  getProductById: async (id: number): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/products/${id}`)
    if (!res.ok) throw new Error(`Failed to fetch product ${id}`)
    return res.json()
  },
}
