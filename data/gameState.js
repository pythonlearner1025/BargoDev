export const gameState = {

    gameId: '',

    time: {
        length: 0,
        begin: 0,
        end: 0,
    },

    roleA: {
        id: '',
        ready: '',
        selection: []
    },

    roleB: {
        id: '',
        ready: '',
        selection: []
    },
}

/*
const sampleGameState = {
    scenario: "scenarioName",
    interestNum: 1,
    interests: [
        {
            name: 'bonus',
            sign: '%',
            options: [
                {'10': 4000},
                {'8':3000},
                {'6':2000},
                {'4':1000},
                {'2':0}
            ]
        },
        // etc, etc
    ]
}
*/