import React, { useState } from 'react'
import { Switch } from 'antd'
import { useGetLeaderboardDataQuery, useLeaderboardStatusUpdateMutation } from '../../redux/apiSlices/leaderboardApi'
import Spinner from '../../components/common/Spinner'

const Leaderboard = () => {
  const { data, isLoading } = useGetLeaderboardDataQuery()
  const [updateStatus] = useLeaderboardStatusUpdateMutation()
  const [isEnabled, setIsEnabled] = useState(true)

  const handleToggle = async (checked) => {
    setIsEnabled(checked)
    try {
      await updateStatus().unwrap()
    } catch (error) {
      console.error('Failed to update leaderboard status:', error)
      setIsEnabled(!checked) // Revert on error
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    )
  }

  const leaderboardData = data?.data || {}

  const LeaderboardCard = ({ title, data, scoreKey }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
        
        {/* Table */}
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">#</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">User</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                    <td className="py-3 px-4 text-gray-700">{item.name}</td>
                    <td className="py-3 px-4 text-gray-700 text-right">{item[scoreKey] || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header with Title and Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Leaderboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-gray-700">Status:</span>
          <Switch
            checked={isEnabled}
            onChange={handleToggle}
            className="bg-primary"
          />
        </div>
      </div>

      {/* Three Leaderboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LeaderboardCard
          title="Total Time (Minutes)"
          data={leaderboardData.topByMatTime}
          scoreKey="matTime"
        />
        <LeaderboardCard
          title="Streaks (Login Count)"
          data={leaderboardData.topByLoginCount}
          scoreKey="loginCount"
        />
        <LeaderboardCard
          title="Sessions Completed"
          data={leaderboardData.topByCompletedSessions}
          scoreKey="completedSessionsCount"
        />
      </div>
    </div>
  )
}

export default Leaderboard