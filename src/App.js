import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const FoodSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = foods.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods([]);
    }
  }, [searchQuery, foods]);

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/foods`);
      setFoods(response.data.foods || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching foods:', error);
      setLoading(false);
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'safe':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'caution':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'avoid':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'safe':
        return 'bg-green-50 border-green-200';
      case 'caution':
        return 'bg-yellow-50 border-yellow-200';
      case 'avoid':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '1.25rem' }}>Loading foods...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          🩺 Gout-Safe Food Checker
        </h1>
        <p style={{ color: '#6B7280' }}>
          Instantly check if foods are safe for your gout diet
        </p>
        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.5rem' }}>
          Database: {foods.length} foods loaded
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', width: '1.25rem', height: '1.25rem' }} />
          <input
            type="text"
            placeholder="Search for any food... (e.g., beef, salmon, spinach)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '3rem',
              paddingRight: '1rem',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              fontSize: '1.125rem',
              border: '2px solid #E5E7EB',
              borderRadius: '0.75rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Search Results */}
      {filteredFoods.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>
            Search Results ({filteredFoods.length})
          </h2>
          {filteredFoods.map((food) => (
            <div
              key={food._id}
              onClick={() => setSelectedFood(food)}
              style={{
                padding: '1rem',
                border: '2px solid',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                borderColor: food.riskLevel === 'safe' ? '#BBF7D0' : food.riskLevel === 'caution' ? '#FDE68A' : '#FECACA',
                backgroundColor: food.riskLevel === 'safe' ? '#F0FDF4' : food.riskLevel === 'caution' ? '#FFFBEB' : '#FEF2F2'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {getRiskIcon(food.riskLevel)}
                  <div>
                    <h3 style={{ fontWeight: '600', color: '#111827' }}>{food.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{food.category}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                    Score: {food.goutImpactScore}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
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
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
          No foods found for "{searchQuery}"
        </div>
      )}

      {/* Food Detail Modal */}
      {selectedFood && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            maxWidth: '42rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.5rem'
          }}>
            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getRiskIcon(selectedFood.riskLevel)}
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                    {selectedFood.name}
                  </h2>
                  <p style={{ color: '#6B7280' }}>{selectedFood.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFood(null)}
                style={{
                  color: '#9CA3AF',
                  fontSize: '1.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#374151' }}>{selectedFood.description}</p>
            </div>

            {/* Why It Triggers Gout */}
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#DBEAFE', borderRadius: '0.5rem' }}>
              <h3 style={{ fontWeight: '600', color: '#1E3A8A', marginBottom: '0.5rem' }}>
                Why It {selectedFood.goutImpactScore < 0 ? "Helps" : "Affects"} Gout:
              </h3>
              <p style={{ color: '#1E40AF' }}>
                {selectedFood.whyItTriggersGout}
              </p>
            </div>

            {/* Serving Guidelines */}
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#D1FAE5', borderRadius: '0.5rem' }}>
              <h3 style={{ fontWeight: '600', color: '#065F46', marginBottom: '0.5rem' }}>
                Serving Guidelines:
              </h3>
              <p style={{ color: '#047857' }}>{selectedFood.servingGuidelines}</p>
            </div>

            {/* Nutritional Info */}
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>
                Nutritional Information (per 100g):
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#F3F4F6', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Calories</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>{selectedFood.nutritionalInfo.calories}</p>
                </div>
                <div style={{ backgroundColor: '#F3F4F6', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Protein</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>{selectedFood.nutritionalInfo.protein}g</p>
                </div>
                <div style={{ backgroundColor: '#F3F4F6', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Purine Content</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#DC2626' }}>
                    {selectedFood.purineContent}mg
                  </p>
                </div>
                <div style={{ backgroundColor: '#F3F4F6', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Gout Impact</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                    {selectedFood.goutImpactScore}/10
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Info Cards */}
      {!searchQuery && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: '#F0FDF4', borderRadius: '0.75rem', border: '2px solid #BBF7D0' }}>
            <CheckCircle style={{ width: '2rem', height: '2rem', color: '#22C55E', marginBottom: '0.5rem' }} />
            <h3 style={{ fontWeight: '600', color: '#166534' }}>Safe Foods</h3>
            <p style={{ color: '#15803D', fontSize: '0.875rem' }}>Low purine, eat freely</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: '#FFFBEB', borderRadius: '0.75rem', border: '2px solid #FDE68A' }}>
            <AlertCircle style={{ width: '2rem', height: '2rem', color: '#F59E0B', marginBottom: '0.5rem' }} />
            <h3 style={{ fontWeight: '600', color: '#92400E' }}>Caution Foods</h3>
            <p style={{ color: '#B45309', fontSize: '0.875rem' }}>Moderate risk, limit intake</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: '#FEF2F2', borderRadius: '0.75rem', border: '2px solid #FECACA' }}>
            <XCircle style={{ width: '2rem', height: '2rem', color: '#EF4444', marginBottom: '0.5rem' }} />
            <h3 style={{ fontWeight: '600', color: '#991B1B' }}>Avoid Foods</h3>
            <p style={{ color: '#B91C1C', fontSize: '0.875rem' }}>High purine, minimize</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;