import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"; // Optional icons
import Loader from "./Loader";

const ingredientCategories = {
  Vegetables: ["tomato", "onion", "potato", "carrot", "spinach", "cabbage", "cauliflower", "peas", "beans", "broccoli", "bell pepper", "cucumber", "lettuce", "zucchini", "radish", "beetroot", "pumpkin", "okra", "mushroom", "avocado"],
  Fruits: ["apple", "banana", "mango", "grapes", "orange", "pear", "kiwi", "pineapple", "pomegranate", "watermelon", "lemon", "lime", "papaya", "strawberry", "blueberry", "raspberry", "cherry", "fig", "plum", "apricot"],
  Dairy: ["milk", "cheese", "paneer", "yogurt", "butter", "cream", "ghee", "curd", "evaporated milk", "condensed milk", "sour cream", "buttermilk", "cottage cheese", "whipping cream", "ice cream", "mozzarella", "cheddar", "parmesan", "ricotta", "blue cheese"],
  Grains: ["rice", "wheat", "oats", "quinoa", "barley", "millet", "corn", "pasta", "bread", "noodles", "semolina", "couscous", "rye", "bulgur", "sorghum", "amaranth", "spaghetti", "tortilla", "crackers", "flour"],
  Proteins: ["chicken", "beef", "pork", "fish", "eggs", "tofu", "tempeh", "lentils", "chickpeas", "kidney beans", "moong dal", "black beans", "soybeans", "paneer", "seitan", "turkey", "salmon", "sardines", "mutton", "duck"],
  Spices: ["salt", "pepper", "cumin", "turmeric", "coriander", "chili powder", "mustard seeds", "cardamom", "cloves", "cinnamon", "nutmeg", "fennel", "asafoetida", "bay leaf", "fenugreek", "paprika", "oregano", "thyme", "basil", "rosemary"],
  Condiments: ["soy sauce", "vinegar", "ketchup", "mustard", "mayonnaise", "hot sauce", "barbecue sauce", "chutney", "relish", "pesto", "salsa", "horseradish", "tahini", "fish sauce", "teriyaki sauce", "sriracha", "aioli", "hoisin sauce", "wasabi", "tartar sauce"],
  Oils: ["olive oil", "vegetable oil", "canola oil", "sunflower oil", "coconut oil", "ghee", "butter", "mustard oil", "sesame oil", "peanut oil", "corn oil", "soybean oil", "grapeseed oil", "avocado oil", "almond oil", "walnut oil", "linseed oil", "rice bran oil", "safflower oil", "hazelnut oil"],
  Herbs: ["cilantro", "parsley", "basil", "mint", "oregano", "thyme", "rosemary", "dill", "chives", "tarragon", "sage", "lemongrass", "bay leaf", "fennel", "marjoram", "lavender", "curry leaves", "spring onion", "scallion", "leek"],
  Sweeteners: ["sugar", "honey", "jaggery", "maple syrup", "agave nectar", "molasses", "stevia", "brown sugar", "coconut sugar", "corn syrup", "date syrup", "sorbitol", "xylitol", "saccharin", "erythritol", "monk fruit", "fructose", "glucose", "lactose", "maltose"]
};

const IngredientSelector = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openCategory, setOpenCategory] = useState(null);
  const [searchTerms, setSearchTerms] = useState({});
  const [categoryIngredients, setCategoryIngredients] = useState(ingredientCategories);
  const [showRecipes, setShowRecipes] = useState(false);
  const [recipeIndex, setRecipeIndex] = useState(0);

  const playPop = () => {
    const audio = new Audio("/pop.mp3");
    audio.volume = 0.3;
    audio.play();
  };

  const playTrash = () => {
    const audio = new Audio("/trash.mp3");
    audio.volume = 0.3;
    audio.play();
  };
  

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      playTrash(); // Play trash sound on removal
      setSelectedIngredients(selectedIngredients.filter((ing) => ing !== ingredient));
    } else if (selectedIngredients.length < 10) {
      playPop(); // Play pop sound on add
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };
  

  const generateRecipes = async () => {
    setLoading(true);
    setErrorMsg("");
    setRecipes([]);
    setRecipeIndex(0);

    try {
      const response = await axios.post(
        "http://switchyard.proxy.rlwy.net:33720/generate-recipes", // Use proxy URL here
        { ingredients: selectedIngredients },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRecipes(response.data);
      setShowRecipes(true);
    } catch (err) {
      console.error("Error:", err);
      setErrorMsg("Something went wrong while generating recipes. Please try again.");
    }

    setLoading(false);
  };


  const handleSearchChange = (category, value) => {
    setSearchTerms({ ...searchTerms, [category]: value });
  };

  const handleAddCustomIngredient = (category, value) => {
    if (!selectedIngredients.includes(value) && selectedIngredients.length < 10) {
      setSelectedIngredients([...selectedIngredients, value]);
      setCategoryIngredients((prev) => ({
        ...prev,
        [category]: [...prev[category], value]
      }));
      setSearchTerms((prev) => ({ ...prev, [category]: "" }));
    }
  };

  const generateAnotherRecipe = () => {
    setShowRecipes(false);
    setSelectedIngredients([]);
  };

  const nextRecipe = () => {
    setRecipeIndex((prev) => (prev + 1) % recipes.length);
  };

  const prevRecipe = () => {
    setRecipeIndex((prev) => (prev - 1 + recipes.length) % recipes.length);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Pick Up to 10 Ingredients</h1>

      {selectedIngredients.length > 0 && !showRecipes && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-center">Selected Ingredients</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {selectedIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center bg-green-600 text-white px-3 py-1 rounded-full text-sm"
              >
                {ingredient}
                <button
                  onClick={() => {
                    playTrash();
                    setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient));
                  }}
                  className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showRecipes && (
        <div className="mb-6">
          {Object.keys(categoryIngredients).map((category) => {
            const searchTerm = searchTerms[category]?.toLowerCase() || "";
            const filteredIngredients = categoryIngredients[category].filter((ing) =>
              ing.toLowerCase().includes(searchTerm)
            );

            return (
              <div key={category} className="mb-4 border bg-blue-50 rounded-xl shadow">
                <button
                  className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 font-semibold text-lg flex justify-between"
                  onClick={() => setOpenCategory(openCategory === category ? null : category)}
                >
                  <span>{category}</span>
                  <span>{openCategory === category ? "▲" : "▼"}</span>
                </button>
                <AnimatePresence initial={false}>
                  {openCategory === category && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 py-2"
                    >
                      <input
                        type="text"
                        placeholder="Search ingredients..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(category, e.target.value)}
                        className="w-full px-3 py-2 mb-2 border rounded"
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {filteredIngredients.map((ingredient) => (
                          <button
                            key={ingredient}
                            onClick={() => toggleIngredient(ingredient)}
                            className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 ease-in-out shadow ${
                              selectedIngredients.includes(ingredient)
                                ? "bg-green-500 text-white border-green-600"
                                : "bg-white text-black hover:bg-gray-100"
                            }`}
                          >
                            {ingredient}
                          </button>
                        ))}
                      </div>

                      <div className="mt-2 flex justify-center">
                        <button
                          onClick={() => handleAddCustomIngredient(category, searchTerms[category])}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          Add Custom Ingredient
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {selectedIngredients.length > 0 && !loading && !showRecipes && (
        <div className="mt-6 text-center">
          <button
            onClick={generateRecipes}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
          >
            Generate Recipes
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center mt-6">
          <Loader />
        </div>
      )}

      {errorMsg && <p className="text-red-500 text-center mt-4">{errorMsg}</p>}

      {showRecipes && recipes.length > 0 && (
  <div className="mt-10 flex flex-col items-center px-4">
    <h2 className="text-2xl font-bold text-purple-700 mb-6">
      🍽️ Recipe {recipeIndex + 1} of {recipes.length}
    </h2>

    <AnimatePresence mode="wait">
      <motion.div
        key={recipeIndex}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6 rounded-2xl shadow-xl border-2 border-purple-300"
      >
        <h3 className="text-2xl font-extrabold text-purple-800 mb-3">
          {recipes[recipeIndex].title}
        </h3>
        <p className="text-gray-700 italic mb-4">{recipes[recipeIndex].description}</p>

        <h4 className="font-bold text-lg text-purple-600 mt-4 mb-2">🧂 Ingredients</h4>
        <ul className="list-disc list-inside text-gray-800 space-y-1">
          {recipes[recipeIndex].ingredients.map((ingredient, idx) => (
            <li key={idx}>{ingredient}</li>
          ))}
        </ul>

        <h4 className="font-bold text-lg text-purple-600 mt-6 mb-2">👩‍🍳 Instructions</h4>
        <p className="text-gray-800">{recipes[recipeIndex].instructions}</p>
      </motion.div>
    </AnimatePresence>

    <div className="mt-6 flex gap-6">
      <button
        onClick={prevRecipe}
        className="flex items-center gap-2 bg-purple-200 hover:bg-purple-300 text-purple-800 font-semibold px-5 py-2 rounded-full transition"
      >
        <ArrowLeft size={18} /> Prev
      </button>
      <button
        onClick={nextRecipe}
        className="flex items-center gap-2 bg-purple-200 hover:bg-purple-300 text-purple-800 font-semibold px-5 py-2 rounded-full transition"
      >
        Next <ArrowRight size={18} />
      </button>
    </div>

    <div className="mt-8">
      <button
        onClick={generateAnotherRecipe}
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition"
      >
        <Sparkles size={18} /> Generate Another Recipe
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default IngredientSelector;
