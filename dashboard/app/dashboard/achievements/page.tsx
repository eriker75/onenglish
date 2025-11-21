'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import DashboardContent from '../../../components/DashboardContent';

const AchievementsPage = () => {
  const pathname = usePathname();
  const studentStats = {
    level: 5,
    totalPoints: 2450,
    lessonsCompleted: 18,
    streak: 7,
    nextLevelPoints: 500,
  };

  const badges = [
    { id: 1, name: 'First Steps', earned: true, icon: '🏅', description: 'Completed your first lesson' },
    { id: 2, name: 'Grammar Master', earned: true, icon: '📚', description: 'Aced all grammar quizzes' },
    { id: 3, name: 'Week Warrior', earned: true, icon: '🔥', description: '7-day study streak' },
    { id: 4, name: 'Vocabulary Champ', earned: false, icon: '💎', description: 'Learn 1000 words' },
    { id: 5, name: 'Speaking Pro', earned: false, icon: '🎤', description: 'Complete 10 speaking exercises' },
  ];

  const recentAchievements = [
    { id: 1, title: 'Lesson 5 Completed', points: 50, time: '2 hours ago', icon: '✅' },
    { id: 2, title: 'Quiz 3: Perfect Score!', points: 100, time: 'Yesterday', icon: '⭐' },
    { id: 3, title: 'New Badge: Grammar Master', points: 150, time: '2 days ago', icon: '🏅' },
  ];

  const progressData = [
    { skill: 'Reading', progress: 85 },
    { skill: 'Writing', progress: 70 },
    { skill: 'Listening', progress: 92 },
    { skill: 'Speaking', progress: 65 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar variant="student" />

      {/* Main Content */}
      <DashboardContent>
        {/* Top Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">My Achievements</h1>
            <p className="text-gray-600 mt-1">Track your progress and celebrate your wins!</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-[#FF0098] flex items-center justify-center text-white font-bold text-2xl">
            Level {studentStats.level}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#FF0098] rounded-xl p-6 text-white">
            <div className="text-3xl mb-2">💯</div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Total Points</h3>
            <p className="font-heading text-2xl font-bold">{studentStats.totalPoints}</p>
          </div>
          <div className="bg-[#33CC00] rounded-xl p-6 text-white">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Lessons</h3>
            <p className="font-heading text-2xl font-bold">{studentStats.lessonsCompleted}</p>
          </div>
          <div className="bg-[#f2bf3c] rounded-xl p-6 text-white">
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Day Streak</h3>
            <p className="font-heading text-2xl font-bold">{studentStats.streak}</p>
          </div>
          <div className="bg-[#9000d9] rounded-xl p-6 text-white">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-sm font-medium opacity-90 mb-1">To Next Level</h3>
            <p className="font-heading text-2xl font-bold">{studentStats.nextLevelPoints}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Badges Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-heading text-2xl font-semibold mb-6">My Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`aspect-square rounded-xl p-4 text-center flex flex-col items-center justify-center transition-all ${
                    badge.earned
                      ? 'bg-gradient-to-br from-[#CCFF00] to-[#33CC00] shadow-md'
                      : 'bg-gray-100 opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="font-semibold text-sm">{badge.name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-heading text-2xl font-semibold mb-6">Skills Progress</h2>
            <div className="space-y-4">
              {progressData.map((skill) => (
                <div key={skill.skill}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                    <span className="text-sm font-semibold text-gray-900">{skill.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF0098] to-[#33CC00]"
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-heading text-2xl font-semibold mb-6">Recent Achievements</h2>
          <div className="space-y-4">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.time}</p>
                </div>
                <div className="text-[#FF0098] font-bold">+{achievement.points} pts</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress to Next Level */}
        <div className="mt-8 bg-[#FF0098] rounded-xl p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-2xl font-semibold mb-2">Keep Going!</h3>
              <p className="text-white/90">You're just {studentStats.nextLevelPoints} points away from Level {studentStats.level + 1}</p>
            </div>
            <div className="text-6xl">🌟</div>
          </div>
          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white"
              style={{ width: '75%' }}
            />
          </div>
        </div>
      </DashboardContent>
    </div>
  );
};

export default AchievementsPage;
