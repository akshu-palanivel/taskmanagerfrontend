import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStats } from '../store/tasksSlice';
import { PageLoading } from '../components/Loading';
import Navbar from '../components/Navbar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, isStatsLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (isStatsLoading || !stats) {
    return (
      <>
        <Navbar />
        <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <PageLoading />
        </main>
      </>
    );
  }

  const { statusStats, priorityStats, completionRate, overdueCount, recentTasks, completedByDay } = stats;

  // Status Doughnut Chart
  const statusChartData = {
    labels: ['Todo', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [statusStats.todo, statusStats.inProgress, statusStats.completed],
        backgroundColor: [
          'rgba(100, 116, 139, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgba(100, 116, 139, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  // Priority Bar Chart
  const priorityChartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [priorityStats.low, priorityStats.medium, priorityStats.high],
        backgroundColor: [
          'rgba(100, 116, 139, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(244, 63, 94, 0.8)',
        ],
        borderColor: [
          'rgba(100, 116, 139, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(244, 63, 94, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Completion Trend Line Chart
  const completionTrendData = {
    labels: completedByDay.map((d) => d.day),
    datasets: [
      {
        label: 'Tasks Completed',
        data: completedByDay.map((d) => d.count),
        fill: true,
        backgroundColor: 'rgba(236, 117, 28, 0.1)',
        borderColor: 'rgba(236, 117, 28, 1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: 'rgba(236, 117, 28, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 31, 35, 0.95)',
        titleColor: '#e2e3e5',
        bodyColor: '#9fa2a9',
        borderColor: 'rgba(62, 64, 71, 0.5)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
      },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: '70%',
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#9fa2a9',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9fa2a9',
        },
      },
      y: {
        grid: {
          color: 'rgba(62, 64, 71, 0.3)',
        },
        ticks: {
          color: '#9fa2a9',
          stepSize: 1,
        },
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9fa2a9',
        },
      },
      y: {
        grid: {
          color: 'rgba(62, 64, 71, 0.3)',
        },
        ticks: {
          color: '#9fa2a9',
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  };

  const statCards = [
    {
      label: 'Total Tasks',
      value: statusStats.total,
      icon: ListTodo,
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-500/10',
    },
    {
      label: 'In Progress',
      value: statusStats.inProgress,
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Completed',
      value: statusStats.completed,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Overdue',
      value: overdueCount,
      icon: AlertTriangle,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-500/10',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-dark-100">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-dark-400 mt-1">
              Here's an overview of your task progress
            </p>
          </div>
          <Link to="/tasks" className="btn-primary flex items-center gap-2 w-fit">
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card p-5 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-display font-bold text-dark-100">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text`} style={{ color: stat.color.includes('emerald') ? '#10b981' : stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('rose') ? '#f43f5e' : '#64748b' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completion Rate */}
        <div className="glass-card p-6 mb-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-dark-400 text-sm">Completion Rate</p>
                <p className="text-2xl font-display font-bold text-dark-100">{completionRate}%</p>
              </div>
            </div>
          </div>
          <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <h3 className="text-lg font-display font-semibold text-dark-100 mb-4">
              Task Status
            </h3>
            <div className="h-64">
              <Doughnut data={statusChartData} options={doughnutOptions} />
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '600ms' }}>
            <h3 className="text-lg font-display font-semibold text-dark-100 mb-4">
              Tasks by Priority
            </h3>
            <div className="h-64">
              <Bar data={priorityChartData} options={barOptions} />
            </div>
          </div>

          {/* Completion Trend */}
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '700ms' }}>
            <h3 className="text-lg font-display font-semibold text-dark-100 mb-4">
              Completion Trend (7 Days)
            </h3>
            <div className="h-64">
              <Line data={completionTrendData} options={lineOptions} />
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-dark-100">
              Recent Tasks
            </h3>
            <Link
              to="/tasks"
              className="text-primary-500 hover:text-primary-400 text-sm font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentTasks && recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        task.status === 'Completed'
                          ? 'bg-emerald-500'
                          : task.status === 'In Progress'
                          ? 'bg-blue-500'
                          : 'bg-slate-500'
                      }`}
                    />
                    <p className="text-dark-200 truncate">{task.title}</p>
                  </div>
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded ${
                      task.priority === 'High'
                        ? 'bg-rose-500/20 text-rose-400'
                        : task.priority === 'Medium'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-dark-400">No tasks yet. Create your first task!</p>
              <Link to="/tasks" className="btn-primary mt-4 inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Task
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
