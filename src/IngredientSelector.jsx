import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const categorizedIngredients = {
    Carbohydrates: [
      "rice", "bread", "pasta", "quinoa", "oats", "barley", "potato", "sweet potato", "corn", "yam",
      "couscous", "buckwheat", "millet", "sorghum", "crackers", "tortilla", "noodles", "cereal", "semolina", "moong dal"
    ],
    Proteins: [
      "paneer", "milk", "cheese", "yogurt", "butter", "ghee", "chickpeas", "lentils", "kidney beans", "moong dal",
      "eggs", "tofu", "soy chunks", "greek yogurt", "peanut butter", "almonds", "cashews", "flax seeds", "chia seeds", "pumpkin seeds"
    ],
    Fibers: [
      "spinach", "broccoli", "carrot", "peas", "beans", "zucchini", "lettuce", "cabbage", "cauliflower", "pumpkin",
      "beetroot", "okra", "eggplant", "kale", "mustard greens", "arugula", "bok choy", "radish", "celery", "asparagus"
    ],
    Vegetables: [
      "tomato", "onion", "garlic", "ginger", "bell pepper", "cucumber", "green chili", "leek", "spring onion", "scallion",
      "avocado", "turnip", "chives", "mint", "cilantro", "parsley", "basil", "dill", "rosemary", "thyme"
    ],
    Fruits: [
      "lemon", "lime", "avocado", "coconut", "banana", "apple", "orange", "berries", "mango", "papaya",
      "grapes", "pineapple", "fig", "pomegranate", "guava", "pear", "melon", "plum", "kiwi", "dates"
    ],
    Fats: [
      "butter", "ghee", "olive oil", "vegetable oil", "cheese", "paneer", "avocado", "mayonnaise", "nuts", "seeds",
      "coconut", "flax oil", "sesame oil", "sunflower oil", "margarine", "cream", "peanut butter", "chia seeds", "walnuts", "almonds"
    ],
    Spices: [
      "salt", "sugar", "pepper", "cumin", "mustard seeds", "turmeric", "coriander", "cinnamon", "nutmeg", "cardamom",
      "clove", "bay leaf", "asafoetida", "paprika", "chili powder", "garam masala", "fenugreek", "black pepper", "ginger powder", "onion powder"
    ],
    Condiments: [
      "soy sauce", "vinegar", "honey", "jaggery", "ketchup", "mustard", "hot sauce", "barbecue sauce", "chutney", "pickle",
      "mayonnaise", "tamarind", "sriracha", "green chutney", "tahini", "pesto", "hoisin sauce", "fish sauce", "wasabi", "teriyaki sauce"
    ],
    Baking: [
      "baking powder", "baking soda", "flour", "cornstarch", "yeast", "vanilla extract", "cocoa powder", "brown sugar", "icing sugar", "molasses",
      "cream of tartar", "almond flour", "cake mix", "self-raising flour", "arrowroot", "gelatin", "condensed milk", "evaporated milk", "buttermilk", "chocolate chips"
    ],
    Herbs: [
      "mint", "basil", "cilantro", "parsley", "thyme", "rosemary", "dill", "oregano", "tarragon", "lemongrass",
      "sage", "marjoram", "chervil", "bay leaf", "fennel", "lavender", "chives", "sorrel", "curry leaves", "epazote"
    ]
  };
  

const IngredientSelector = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((ing) => ing !== ingredient));
    } else if (selectedIngredients.length < 10) {
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Pick Up to 10 Ingredients</h1>

    <div className="space-y-6 mb-6">
        {Object.entries(categorizedIngredients).map(([category, items]) => (
            <div key={category}>
            <h2 className="text-xl font-semibold mb-2 text-blue-700">{category}</h2>
            <div className="flex flex-wrap gap-2">
                {items.map((ingredient) => (
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
            </div>
        ))}
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
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
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left px-6 py-4 font-semibold text-lg bg-blue-50 hover:bg-blue-100 transition flex justify-between items-center"
              >
                <span>{recipe.title}</span>
                <span>{openIndex === idx ? "▲" : "▼"}</span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === idx && (
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
