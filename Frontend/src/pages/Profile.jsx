import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    motivation: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchAchievements();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProfile(data);
      setEditForm({
        username: data.username,
        email: data.email,
        motivation: data.motivation
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/achievements', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data);
        updateUser(data);
        setEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  // XP/Level Progress Calculation Helpers
  const getLevelThreshold = (level) => (level * level) * 100;
  const getPrevLevelThreshold = (level) => ((level - 1) * (level - 1)) * 100;

  const getLevelProgressInfo = () => {
    if (!profile) return { current: 0, needed: 1, percent: 0 };
    const level = profile.level;
    const xp = profile.xp;
    const prevLevelXP = getPrevLevelThreshold(level);
    const nextLevelXP = getLevelThreshold(level);
    const xpInLevel = xp - prevLevelXP;
    const xpNeeded = nextLevelXP - prevLevelXP;
    const percent = Math.max(0, Math.min(100, (xpInLevel / xpNeeded) * 100));
    return { current: Math.max(0, xpInLevel), needed: xpNeeded, percent };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-32 bg-gray-300 rounded-full w-32 mx-auto mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Profile</h1>
          <p className="text-gray-600">Your journey and achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {profile?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{profile?.username}</h2>
                <p className="text-gray-600">{profile?.email}</p>
              </div>

              {/* Level Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Level {profile?.level}</span>
                  <span className="text-sm text-gray-500">
                    {getLevelProgressInfo().current} / {getLevelProgressInfo().needed} XP
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getLevelProgressInfo().percent}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Coins</span>
                  <span className="font-semibold flex items-center">
                    <span className="mr-1">💰</span>
                    {profile?.coins}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Streak</span>
                  <span className="font-semibold flex items-center">
                    <span className="mr-1">🔥</span>
                    {profile?.streak} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tasks Completed</span>
                  <span className="font-semibold">{profile?.stats?.completedTasks || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold">{profile?.stats?.completionRate || 0}%</span>
                </div>
              </div>

              {/* Motivation */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Motivation</h3>
                {editing ? (
                  <textarea
                    value={editForm.motivation}
                    onChange={(e) => setEditForm({ ...editForm, motivation: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                    rows="3"
                    placeholder="What motivates you?"
                  />
                ) : (
                  <p className="text-gray-600 italic">"{profile?.motivation}"</p>
                )}
              </div>

              {/* Edit Profile */}
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Username"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Email"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEditForm({
                          username: profile.username,
                          email: profile.email,
                          motivation: profile.motivation
                        });
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Achievements</h2>
              
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                    >
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No achievements yet</h3>
                  <p className="text-gray-500">Complete more tasks to unlock achievements!</p>
                </div>
              )}
            </div>

            {/* Detailed Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Tasks</span>
                      <span className="font-semibold">{profile?.stats?.totalTasks || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Completed Tasks</span>
                      <span className="font-semibold">{profile?.stats?.completedTasks || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total XP Earned</span>
                      <span className="font-semibold">{profile?.stats?.totalXP || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Coins Earned</span>
                      <span className="font-semibold">{profile?.stats?.totalCoins || 0}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-semibold">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Login</span>
                      <span className="font-semibold">
                        {profile?.lastLoginDate ? new Date(profile.lastLoginDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Tasks Completed</span>
                      <span className="font-semibold">{profile?.totalTasksCompleted || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 