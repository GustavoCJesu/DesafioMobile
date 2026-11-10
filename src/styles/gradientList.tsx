export const gradients = {
  primary: {
    colors: ['#33447f', '#4b5ce3'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  primaryDiagonal: {
    colors: ['#33447f', '#4b5ce3'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  hero: {
    colors: ['#1c2742', '#26365c', '#34518b'],
    locations: [0, 0.55, 1],
    start: { x: 0.33, y: 0 },
    end: { x: 0.67, y: 1 },
  },
  heroCard: {
    colors: ['#1c2742', '#2a3c66', '#3a539a'],
    locations: [0, 0.6, 1],
    start: { x: 0.25, y: 0 },
    end: { x: 0.75, y: 1 },
  },
  nrBadge: {
    colors: ['#2a3c66', '#4152b8'],
    start: { x: 0.25, y: 0 },
    end: { x: 0.75, y: 1 },
  },
} as const