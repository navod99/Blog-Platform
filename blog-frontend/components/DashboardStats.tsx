interface StatsProps {
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalLikes: number;
    totalComments: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Posts</h3>
        <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
      </div>
      <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Published</h3>
        <p className="text-2xl font-bold text-green-600">{stats.publishedPosts}</p>
      </div>
      <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Drafts</h3>
        <p className="text-2xl font-bold text-yellow-600">{stats.draftPosts}</p>
      </div>
      <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Likes</h3>
        <p className="text-2xl font-bold text-red-600">{stats.totalLikes}</p>
      </div>
      <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Comments</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.totalComments}</p>
      </div>
    </div>
  );
}