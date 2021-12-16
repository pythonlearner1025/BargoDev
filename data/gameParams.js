export const gameParams = {
    interests: [
        {
            name: 'Bonus',
            type: 'logical',
            options: [10,8,6,4,2],
            scores: undefined
        },
        {
            name: 'Vacation Length',
            type: 'logical',
            options: [25,20,15,10,5],
            scores: undefined
        },
        {
            name: 'Starting Date',
            type: 'logical',
            options: ['June 1', 'June 15', 'July 1', 'July 15', 'August 1'],
            scores: undefined
        },
        {
            name: 'Salary',
            type: 'logical',
            options: [50000, 48000, 46000, 44000, 42000],
            scores: undefined
        },
        {
            name: 'Location',
            type: 'illogical',
            options: ['San Franciso', 'Seoul', 'Tokyo', 'New York', 'Bangladesh'],
            scores: undefined
        }
      ],
      scores: [
          [0, 300, 600, 900, 1200],
          [0, 600, 1200, 1800, 2400],
          [0, 1000, 2000, 3000, 4000],
          [0, -1500, -3000, -4000, -6000],
          [0, 800, 1600, 2400, 3200]
      ]
}