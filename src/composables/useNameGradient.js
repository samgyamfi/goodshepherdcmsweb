const gradients = [
  ['#7c2d12', '#ea580c'], ['#881337', '#e11d48'], ['#701a75', '#c026d3'],
  ['#4c1d95', '#7c3aed'], ['#312e81', '#4f46e5'], ['#1e3a8a', '#2563eb'],
  ['#0c4a6e', '#0284c7'], ['#164e63', '#0891b2'], ['#134e4a', '#0d9488'],
  ['#14532d', '#16a34a'], ['#365314', '#65a30d'], ['#713f12', '#ca8a04'],
  ['#7f1d1d', '#dc2626'], ['#9f1239', '#f43f5e'], ['#86198f', '#d946ef'],
  ['#581c87', '#9333ea'], ['#3730a3', '#6366f1'], ['#1d4ed8', '#38bdf8'],
  ['#0369a1', '#22d3ee'], ['#0f766e', '#2dd4bf'], ['#15803d', '#84cc16'],
  ['#4d7c0f', '#eab308'], ['#a16207', '#f97316'], ['#b91c1c', '#fb7185'],
  ['#be123c', '#f472b6'], ['#a21caf', '#c084fc'], ['#6d28d9', '#818cf8'],
  ['#4338ca', '#60a5fa'], ['#1d4ed8', '#2dd4bf'], ['#0e7490', '#34d399'],
  ['#047857', '#a3e635'], ['#3f6212', '#facc15'], ['#854d0e', '#fb923c'],
  ['#991b1b', '#e879f9'], ['#9d174d', '#a78bfa'], ['#6b21a8', '#38bdf8'],
  ['#5b21b6', '#22d3ee'], ['#3730a3', '#34d399'], ['#1e40af', '#a3e635'],
  ['#075985', '#facc15'], ['#115e59', '#fb923c'], ['#166534', '#fb7185'],
  ['#3f6212', '#f472b6'], ['#92400e', '#c084fc'], ['#9a3412', '#818cf8'],
  ['#9f1239', '#60a5fa'], ['#831843', '#2dd4bf'], ['#701a75', '#84cc16'],
  ['#4c1d95', '#eab308'], ['#172554', '#f97316'],
]

function hash(value = '') {
  return [...String(value)].reduce((total, character) => {
    return (total * 31 + character.charCodeAt(0)) >>> 0
  }, 0)
}

export function useNameGradient() {
  function gradientFor(value) {
    const [from, to] = gradients[hash(value) % gradients.length]
    return `linear-gradient(135deg, ${from}, ${to})`
  }

  function initialsFor(value = '') {
    const words = value.trim().split(/\s+/).filter(Boolean)
    return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase() || '?'
  }

  return { gradientFor, initialsFor }
}
