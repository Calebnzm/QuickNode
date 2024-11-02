import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Register from './components/Register'
import SendMoney from './components/SendMoney'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ConfirmPayment from './components/ConfirmPayment'

function App() {
  const isLoggedIn = localStorage.getItem('user');

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="p-4 bg-[#0D3B66] shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="PayPyusd Logo" className="h-10" />
              <span className="text-white text-xl font-bold">PayPyusd</span>
            </div>
            <div className="flex gap-4 text-white">
              {!isLoggedIn ? (
                <>
                  <Link to="/register" className="hover:text-[#F4A261] transition-colors">Register</Link>
                  <Link to="/login" className="hover:text-[#F4A261] transition-colors">Login</Link>
                </>
              ) : (
                <>
                  {/* <Link to="/dashboard" className="hover:text-[#F4A261] transition-colors">Dashboard</Link>
                  <Link to="/send-money" className="hover:text-[#F4A261] transition-colors">Send Money</Link> */}
                </>
              )}
            </div>
            {isLoggedIn && (
              <button 
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="px-4 py-2 bg-[#F4A261] text-[#0D3B66] font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F4A261] focus:ring-opacity-50"
            >
              Logout
            </button>
            )}
          </div>
        </nav>

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full p-8 bg-white rounded-lg shadow-lg">
            <Routes>
              <Route path="/" element={isLoggedIn ? <Dashboard /> : <Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/send-money" element={<SendMoney />} />
              <Route path="/confirm-payment" element={<ConfirmPayment />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App