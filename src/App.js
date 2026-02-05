import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, AlertCircle, XCircle, Info, BookOpen, Users, Heart } from 'lucide-react';
import './App.css';

const App = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeTab, setActiveTab] = useState('search');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await fetch('https://gout-safe-backend-production.up.railway.app/api/foods');
      const data = await response.json();
      setFoods(data.foods);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching foods:', error);
      setLoading(false);
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskIcon = (riskLevel) => {
    if (riskLevel === 'safe') return <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#22C55E' }} />;
    if (riskLevel === 'caution') return <AlertCircle style={{ width: '1.5rem', height: '1.5rem', color: '#F59E0B' }} />;
    return <XCircle style={{ width: '1.5rem', height: '1.5rem', color: '#EF4444' }} />;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your gout-safe food database...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="emoji">🩺</span>
            Gout-Safe Food Checker
          </h1>
          <p className="app-subtitle">
            Make informed dietary choices for better gout management
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Search size={18} />
          <span>Search Foods</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <Info size={18} />
          <span>About Gout</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          <BookOpen size={18} />
          <span>Diet Guide</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="search-tab">
            {/* Welcome Banner */}
            {!searchQuery && (
              <div className="welcome-banner">
                <h2>👋 Welcome to Your Gout Diet Assistant</h2>
                <p>Search from our comprehensive database of foods to check their gout safety levels, purine content, and serving guidelines.</p>
              </div>
            )}

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for any food... (e.g., paneer, chicken, dal)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Search Results */}
            {filteredFoods.length > 0 && searchQuery && (
              <div className="search-results">
                <h2 className="results-title">
                  Search Results ({filteredFoods.length})
                </h2>
                {filteredFoods.map((food) => (
                  <div
                    key={food._id}
                    onClick={() => setSelectedFood(food)}
                    className={`food-card risk-${food.riskLevel}`}
                  >
                    <div className="food-card-content">
                      <div className="food-card-left">
                        {getRiskIcon(food.riskLevel)}
                        <div className="food-info">
                          <h3 className="food-name">{food.name}</h3>
                          <p className="food-category">{food.category}</p>
                        </div>
                      </div>
                      <div className="food-card-right">
                        <div className="gout-score">
                          Score: {food.goutImpactScore}
                        </div>
                        <div className="purine-content">
                          {food.purineContent}mg purine
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {searchQuery && filteredFoods.length === 0 && (
              <div className="no-results">
                <p>No foods found for "{searchQuery}"</p>
                <p className="suggestion">Try searching for common items like chicken, rice, or vegetables</p>
              </div>
            )}

            {/* Quick Info Cards */}
            {!searchQuery && (
              <div className="info-cards-grid">
                <div className="info-card safe">
                  <CheckCircle className="info-card-icon" />
                  <h3>Safe Foods</h3>
                  <p>Low purine content (&lt;100mg)</p>
                  <p className="info-card-detail">Eat freely without restrictions</p>
                </div>
                <div className="info-card caution">
                  <AlertCircle className="info-card-icon" />
                  <h3>Caution Foods</h3>
                  <p>Moderate purine (100-200mg)</p>
                  <p className="info-card-detail">Limit to small servings</p>
                </div>
                <div className="info-card avoid">
                  <XCircle className="info-card-icon" />
                  <h3>Avoid Foods</h3>
                  <p>High purine (&gt;200mg)</p>
                  <p className="info-card-detail">Minimize or eliminate</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="content-tab">
            <div className="content-section">
              <h2><Heart className="inline-icon" /> What is Gout?</h2>
              <p>Gout is a type of inflammatory arthritis that causes sudden, severe attacks of pain, swelling, and redness in joints. It occurs when uric acid builds up in the blood and forms crystals in the joints.</p>
              
              <div className="highlight-box">
                <h3>Key Facts:</h3>
                <ul>
                  <li>Affects approximately 4% of adults globally</li>
                  <li>More common in men than women</li>
                  <li>Can be managed through diet and medication</li>
                  <li>Often affects the big toe first</li>
                </ul>
              </div>

              <h3>Understanding Purines</h3>
              <p>Purines are natural substances found in many foods. When your body breaks down purines, it produces uric acid. For people with gout, managing purine intake is crucial to preventing flare-ups.</p>

              <div className="purine-scale">
                <div className="purine-level low">
                  <strong>Low Purines</strong>
                  <p>&lt;100mg per 100g</p>
                  <small>Safe to eat regularly</small>
                </div>
                <div className="purine-level moderate">
                  <strong>Moderate Purines</strong>
                  <p>100-200mg per 100g</p>
                  <small>Eat in moderation</small>
                </div>
                <div className="purine-level high">
                  <strong>High Purines</strong>
                  <p>&gt;200mg per 100g</p>
                  <small>Minimize or avoid</small>
                </div>
              </div>

              <h3>Symptoms to Watch For</h3>
              <ul className="symptoms-list">
                <li>Intense joint pain, especially at night</li>
                <li>Lingering discomfort lasting days to weeks</li>
                <li>Inflammation and redness in affected joint</li>
                <li>Limited range of motion</li>
              </ul>
            </div>
          </div>
        )}

        {/* Diet Guide Tab */}
        {activeTab === 'guide' && (
          <div className="content-tab">
            <div className="content-section">
              <h2><BookOpen className="inline-icon" /> Gout-Friendly Diet Guidelines</h2>
              
              <div className="diet-section good">
                <h3>✅ Foods to Enjoy</h3>
                <div className="food-list">
                  <div className="food-category-list">
                    <h4>Vegetables</h4>
                    <p>Most vegetables are safe, including spinach, cauliflower, mushrooms</p>
                  </div>
                  <div className="food-category-list">
                    <h4>Fruits</h4>
                    <p>Cherries, berries, apples, oranges</p>
                  </div>
                  <div className="food-category-list">
                    <h4>Whole Grains</h4>
                    <p>Rice, whole wheat bread, oats, quinoa</p>
                  </div>
                  <div className="food-category-list">
                    <h4>Dairy</h4>
                    <p>Low-fat milk, yogurt, cheese</p>
                  </div>
                  <div className="food-category-list">
                    <h4>Beverages</h4>
                    <p>Water (8+ glasses daily), coffee, tea</p>
                  </div>
                </div>
              </div>

              <div className="diet-section moderate">
                <h3>⚠️ Foods to Limit</h3>
                <div className="food-list">
                  <div className="food-category-list">
                    <h4>Meats</h4>
                    <p>Chicken, pork, lamb - limit to 4-6 oz portions</p>
                  </div>
                  <div className="food-category-list">
                    <h4>Seafood</h4>
                    <p>Crab, lobster, shrimp - occasional servings only</p>
                  </div>
                  <div className="food-category-list">
                    <h4>Vegetables</h4>
                    <p>Asparagus, cauliflower - moderate amounts</p>
                  </div>
                </div>
              </div>

              <div className="diet-section avoid">
                <h3>🚫 Foods to Avoid</h3>
                <div className="food-list">
                  <div className="food-category-list">
                    <h4>Organ Meats</h4>
                    <p>Liver, kidney, brain, sweetbreads</p>
                  </div>
                  <div className="food-category-list">
                    <h4>High-Purine Seafood</h4>
                    <p>Anchovies, sardines, mackerel, herring</p>
                  </div>
                  <div className="food-category-list">
                    <h4>Beverages</h4>
                    <p>Alcohol (especially beer), sugary drinks</p>
                  </div>
                  <div className="food-category-list">
                    <h4>Game Meats</h4>
                    <p>Venison, duck, goose</p>
                  </div>
                </div>
              </div>

              <div className="tips-box">
                <h3>💡 Quick Tips</h3>
                <ul>
                  <li>Stay well hydrated - aim for 8-12 glasses of water daily</li>
                  <li>Maintain a healthy weight</li>
                  <li>Limit alcohol consumption</li>
                  <li>Avoid high-fructose corn syrup</li>
                  <li>Consider vitamin C supplements (consult your doctor)</li>
                  <li>Keep a food diary to identify triggers</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer with Signature */}
      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-text">
            Built with ❤️ for better health management
          </p>
          <p className="footer-signature">
            Created by <strong>Vinay Kumar</strong> | © 2024
          </p>
          <p className="footer-disclaimer">
            Disclaimer: This tool provides general information. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </footer>

      {/* Food Detail Modal */}
      {selectedFood && (
        <div className="modal-overlay" onClick={() => setSelectedFood(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <div className="modal-header">
              <div className="modal-title-section">
                {getRiskIcon(selectedFood.riskLevel)}
                <div>
                  <h2 className="modal-food-name">{selectedFood.name}</h2>
                  <p className="modal-food-category">{selectedFood.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFood(null)}
                className="modal-close-button"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <div className="modal-description">
              <p>{selectedFood.description}</p>
            </div>

            {/* Why It Triggers Gout */}
            <div className="modal-info-box impact">
              <h3>Why It {selectedFood.goutImpactScore < 0 ? "Helps" : "Affects"} Gout:</h3>
              <p>{selectedFood.whyItTriggersGout}</p>
            </div>

            {/* Serving Guidelines */}
            <div className="modal-info-box serving">
              <h3>Serving Guidelines:</h3>
              <p>{selectedFood.servingGuidelines}</p>
            </div>

            {/* Nutritional Info */}
            <div className="modal-nutrition">
              <h3>Nutritional Information (per 100g):</h3>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <p className="nutrition-label">Calories</p>
                  <p className="nutrition-value">{selectedFood.nutritionalInfo.calories}</p>
                </div>
                <div className="nutrition-item">
                  <p className="nutrition-label">Protein</p>
                  <p className="nutrition-value">{selectedFood.nutritionalInfo.protein}g</p>
                </div>
                <div className="nutrition-item">
                  <p className="nutrition-label">Purine Content</p>
                  <p className="nutrition-value purine">{selectedFood.purineContent}mg</p>
                </div>
                <div className="nutrition-item">
                  <p className="nutrition-label">Gout Impact</p>
                  <p className="nutrition-value">{selectedFood.goutImpactScore}/10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;