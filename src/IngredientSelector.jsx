import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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

  const playPop = () => {
    const audio = new Audio("/pop.mp3");
    audio.volume = 0.3;
    audio.play();
  };

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((ing) => ing !== ingredient));
    } else if (selectedIngredients.length < 10) {
      playPop();
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const generateRecipes = async () => {
    setLoading(true);
    setErrorMsg("");
    setRecipes([]);

    try {
      const response = await axios.post(
        "https://recipe-mailer-backend-production.up.railway.app/generate-recipes",
        { ingredients: selectedIngredients }
      );
      setRecipes(response.data);
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

      // Add to initial category list
      setCategoryIngredients((prev) => ({
        ...prev,
        [category]: [...prev[category], value]
      }));

      setSearchTerms((prev) => ({ ...prev, [category]: "" }));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Pick Up to 10 Ingredients</h1>

      {selectedIngredients.length > 0 && (
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
                    onClick={() =>
                    setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient))
                    }
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


      <div className="mb-6">
        {Object.keys(categoryIngredients).map((category, idx) => {
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
                    className="px-4 py-3"
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerms[category] || ""}
                      onChange={(e) => handleSearchChange(category, e.target.value)}
                      className="mb-3 p-2 border rounded w-full"
                    />

                    {searchTerms[category] && !categoryIngredients[category].includes(searchTerms[category]) && (
                      <button
                        onClick={() => handleAddCustomIngredient(category, searchTerms[category])}
                        className="mb-3 text-sm text-green-700 underline"
                      >
                        Add "{searchTerms[category]}" to {category}
                      </button>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {filteredIngredients.map((ingredient) => (
                        <button
                          key={ingredient}
                          onClick={() => toggleIngredient(ingredient)}
                          className={`px-3 py-1 text-sm rounded-full border transition ${
                            selectedIngredients.includes(ingredient)
                              ? "bg-green-600 text-white"
                              : "bg-white text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          {ingredient}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={generateRecipes}
          disabled={selectedIngredients.length === 0 || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Recipes"}
        </button>
      </div>

      {errorMsg && (
        <p className="text-red-600 text-center font-medium mb-4">{errorMsg}</p>
      )}

      {loading && (
        <div className="flex justify-center my-12">
          <Loader/>
        </div>
      )}

      {!loading && recipes.length > 0 && (
        <div className="space-y-4">
          {recipes.map((recipe, idx) => (
            <div
              key={idx}
              className="border border-gray-300 rounded-xl bg-white shadow overflow-hidden"
            >
              <button
                onClick={() => setOpenCategory(openCategory === `recipe-${idx}` ? null : `recipe-${idx}`)}
                className="w-full text-left px-6 py-4 font-semibold text-lg bg-blue-50 hover:bg-blue-100 transition flex justify-between items-center"
              >
                <span>{recipe.title}</span>
                <span>{openCategory === `recipe-${idx}` ? "▲" : "▼"}</span>
              </button>

              <AnimatePresence initial={false}>
                {openCategory === `recipe-${idx}` && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-4"
                  >
                    <p className="mb-4 text-gray-600">{recipe.description}</p>

                    <div className="mb-2">
                      <h3 className="font-semibold">Ingredients:</h3>
                      <ul className="list-disc list-inside text-gray-700">
                        {recipe.ingredients.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-semibold">Instructions:</h3>
                      <ol className="list-decimal list-inside text-gray-700">
                        {recipe.instructions.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientSelector;