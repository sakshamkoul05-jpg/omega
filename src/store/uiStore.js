import { create } from 'zustand'
import indianProducts from '../data/indianProducts'

const DEFAULT_COLUMNS = [
  { id: 'image', label: 'Image', visible: true, order: 0 },
  { id: 'name', label: 'Name', visible: true, order: 1 },
  { id: 'category', label: 'Category', visible: true, order: 2 },
  { id: 'price', label: 'Price', visible: true, order: 3 },
  { id: 'stock', label: 'Stock', visible: true, order: 4 },
  { id: 'rating', label: 'Rating', visible: true, order: 5 },
  { id: 'actions', label: 'Actions', visible: true, order: 6 },
]

function applyProductUpdate(products, event) {
  return products.map((p) => {
    if (p.id !== event.productId) return p
    const updated = { ...p }
    if (event.type === 'price_update') updated.price = event.newValue
    if (event.type === 'stock_update' || event.type === 'restock') updated.stock = event.newValue
    if (event.type === 'new_review') updated.rating = (p.rating + event.newValue) / 2
    return updated
  })
}

const useUIStore = create((set, get) => ({
  sidebarCollapsed: false,
  sidebarOpen: false,
  columns: DEFAULT_COLUMNS,
  dataUpdatedAt: null,
  products: [],
  productsLoaded: false,
  toasts: [],

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleColumn: (id) => set((state) => ({
    columns: state.columns.map((col) =>
      col.id === id ? { ...col, visible: !col.visible } : col
    ),
  })),

  reorderColumns: (fromIndex, toIndex) => set((state) => {
    const cols = [...state.columns]
    const [moved] = cols.splice(fromIndex, 1)
    cols.splice(toIndex, 0, moved)
    return { columns: cols.map((col, i) => ({ ...col, order: i })) }
  }),

  setDataUpdatedAt: (timestamp) => set({ dataUpdatedAt: timestamp }),

  loadProducts: () => set({
    products: indianProducts,
    productsLoaded: true,
    dataUpdatedAt: Date.now(),
  }),

  handleWsEvent: (event) => set((state) => ({
    products: applyProductUpdate(state.products, event),
    dataUpdatedAt: Date.now(),
    toasts: [...state.toasts.slice(-4), { ...event, timestamp: Date.now() }],
  })),

  dismissToast: (timestamp) => set((state) => ({
    toasts: state.toasts.filter((t) => t.timestamp !== timestamp),
  })),
}))

export default useUIStore
