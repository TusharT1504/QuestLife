import { useState, useEffect } from 'react';
import { habitsService } from '../services/habitsService';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', difficulty: 'medium' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch habits/todos
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await habitsService.getHabits();
      setHabits(data);
    } catch (err) {
      setError('Failed to load habits.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    setError('');
    try {
      if (editingId) {
        await habitsService.updateHabit(editingId, form);
      } else {
        await habitsService.addHabit(form);
      }
      setForm({ title: '', description: '', difficulty: 'medium' });
      setEditingId(null);
      fetchHabits();
    } catch (err) {
      setError('Failed to save habit.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (habit) => {
    setForm({ 
      title: habit.title, 
      description: habit.description || '', 
      difficulty: habit.difficulty || 'medium' 
    });
    setEditingId(habit.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this habit?')) return;
    setLoading(true);
    setError('');
    try {
      await habitsService.deleteHabit(id);
      fetchHabits();
    } catch (err) {
      setError('Failed to delete habit.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRewards = (difficulty) => {
    switch (difficulty) {
      case 'easy': return { xp: 10, coins: 5 };
      case 'medium': return { xp: 25, coins: 10 };
      case 'hard': return { xp: 50, coins: 20 };
      default: return { xp: 25, coins: 10 };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Habits & Todos</h1>
          <p className="text-gray-600">Build better habits, one task at a time</p>
          <p className="text-sm text-gray-500 mt-2">Once completed, tasks remain completed permanently</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">
            {editingId ? 'Edit Habit' : 'Add New Habit'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="What habit do you want to build?"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional details about this habit..."
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={loading}
              >
                <option value="easy">Easy (10 XP, 5 Coins)</option>
                <option value="medium">Medium (25 XP, 10 Coins)</option>
                <option value="hard">Hard (50 XP, 20 Coins)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                className="bg-black text-white rounded-lg px-6 py-3 font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !form.title.trim()}
              >
                {editingId ? 'Update Habit' : 'Add Habit'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="text-gray-600 hover:text-black font-medium"
                  onClick={() => { 
                    setEditingId(null); 
                    setForm({ title: '', description: '', difficulty: 'medium' }); 
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error and Loading */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {/* Habits List */}
        {!loading && habits.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black mb-4">Your Habits</h2>
            {habits.map((habit) => {
              const rewards = getRewards(habit.difficulty);
              return (
                <div key={habit.id} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-black">{habit.title}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(habit.difficulty)}`}>
                          {habit.difficulty}
                        </span>
                      </div>
                      
                      {habit.description && (
                        <p className="text-gray-600 mb-3">{habit.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-green-600 font-medium">+{rewards.xp} XP</span>
                        <span className="text-yellow-600 font-medium">+{rewards.coins} 🪙</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="text-black hover:text-gray-600 font-medium text-sm px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors duration-200"
                        onClick={() => handleEdit(habit)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 rounded border border-red-300 hover:border-red-400 transition-colors duration-200"
                        onClick={() => handleDelete(habit.id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && habits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-black mb-2">No habits yet</h3>
            <p className="text-gray-600">Start building your habits by adding your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Habits; 