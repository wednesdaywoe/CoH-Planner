function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header banner matching legacy app */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-800 text-white py-3 px-5 text-center text-sm font-bold border-b-2 border-pink-600 shadow-lg">
        <span className="mr-2">⚠️</span>
        WORK IN PROGRESS - React Migration Underway
        <span className="mx-2">|</span>
        <span className="opacity-90">Phase 0: Foundation Setup Complete</span>
      </div>

      {/* Placeholder content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            City of Heroes Planner
          </h1>
          <p className="text-gray-400 mb-8">
            React + TypeScript + Tailwind migration in progress
          </p>

          {/* Tech stack badges */}
          <div className="flex justify-center gap-3 mb-8">
            <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">React 18</span>
            <span className="px-3 py-1 bg-blue-700 rounded-full text-sm">TypeScript</span>
            <span className="px-3 py-1 bg-cyan-600 rounded-full text-sm">Tailwind CSS</span>
            <span className="px-3 py-1 bg-purple-600 rounded-full text-sm">Vite</span>
          </div>

          {/* Stat color demo */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">Stat Colors Preview</h2>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <span className="stat-damage">Damage +95%</span>
              <span className="stat-accuracy">Accuracy +42%</span>
              <span className="stat-recharge">Recharge +75%</span>
              <span className="stat-defense">Defense 38%</span>
              <span className="stat-resistance">Resistance 25%</span>
              <span className="stat-recovery">Recovery +45%</span>
            </div>
          </div>

          {/* Link to legacy app */}
          <p className="text-gray-500 text-sm">
            Legacy app still available at{' '}
            <a href="/legacy/index.html" className="text-blue-400 hover:underline">
              /legacy/index.html
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
