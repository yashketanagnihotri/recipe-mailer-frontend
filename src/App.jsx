import { useState } from 'react'
import EmailRecipeSender from './EmailRecipeSender'
import IngredientSelector from './IngredientSelector'
import { Menu, X } from 'lucide-react' // You can use Heroicons or plain SVGs too

function App() {
  const [activeComponent, setActiveComponent] = useState('ingredients')
  const [menuOpen, setMenuOpen] = useState(false)

  const switchComponent = (component) => {
    setActiveComponent(component)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 text-gray-800 relative overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md relative z-30">
        <h1 className="text-2xl font-bold text-indigo-600">🍲 Recipe Magic</h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeComponent === 'ingredients'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-indigo-600 hover:bg-indigo-100'
            }`}
            onClick={() => switchComponent('ingredients')}
          >
            Ingredient Selector
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeComponent === 'email'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-indigo-600 hover:bg-indigo-100'
            }`}
            onClick={() => switchComponent('email')}
          >
            Send Email
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(true)} className="text-indigo-600">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Sidebar Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-indigo-600">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          <button
            onClick={() => switchComponent('ingredients')}
            className={`text-left px-4 py-2 rounded-lg font-medium ${
              activeComponent === 'ingredients'
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            Ingredient Selector
          </button>
          <button
            onClick={() => switchComponent('email')}
            className={`text-left px-4 py-2 rounded-lg font-medium ${
              activeComponent === 'email'
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            Send Email
          </button>
        </div>
      </div>

      {/* Page Content */}
      <main className="p-6 relative z-10">
        {activeComponent === 'ingredients' && <IngredientSelector />}
        {activeComponent === 'email' && <EmailRecipeSender />}
      </main>
    </div>
  )
}

export default App
