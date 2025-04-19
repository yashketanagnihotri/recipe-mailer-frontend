import { useState } from 'react'
import EmailRecipeSender from './EmailRecipeSender'
import IngredientSelector from './IngredientSelector'
import Loader from './Loader'

function App() {
  const [activeComponent, setActiveComponent] = useState('ingredients') // default = recipe generator

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-indigo-600">🍲 Recipe Magic</h1>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeComponent === 'ingredients'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-indigo-600 hover:bg-indigo-100'
            }`}
            onClick={() => setActiveComponent('ingredients')}
          >
            Ingredient Selector
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeComponent === 'email'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-indigo-600 hover:bg-indigo-100'
            }`}
            onClick={() => setActiveComponent('email')}
          >
            Send Email
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-6 animate-fadeIn">
        {activeComponent === 'ingredients' && <IngredientSelector />}
        {activeComponent === 'email' && <EmailRecipeSender />}
      </main>
    </div>
  )
}

export default App
