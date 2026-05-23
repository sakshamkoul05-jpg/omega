import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Products',
}

export default function Layout() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Omega'

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
        <TopNav title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
