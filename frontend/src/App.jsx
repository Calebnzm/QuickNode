import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Register from './components/Register'
import SendMoney from './components/SendMoney'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const isLoggedIn = localStorage.getItem('user');

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <nav className="p-4 bg-blue-600">
          <div className="flex gap-4 text-white">
            {!isLoggedIn ? (
              <>
                <Link to="/register" className="hover:text-blue-200">Register</Link>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/send-money" className="hover:text-blue-200">Send Money</Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                  }}
                  className="hover:text-blue-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>

        <div className="flex items-center justify-center p-8">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Dashboard /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send-money" element={<SendMoney />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App