import mongoose from 'mongoose'
import logger from 'skinwalker'
import ServerState from '../models/serverState.js'
import GroupModel from '../models/groupModel.js'
import express from 'express'
import { readFileSync } from 'fs'

interface Group {
    displayName: string,
    url: string
}

interface StartCallback {
    (): void
}

interface Options {
    databaseIp: string,
    databaseUsername: string,
    databasePasswd: string,
    port: number
    logLevel: "TRACE" | "INFO" | "WARN" | "ERROR"
}

interface Player {
    name: string,
    raw: {
        score: number,
        time: number
    }
}

interface ServerResponse {
    name: string,
    map: string,
    password: boolean,
    raw: {
        protocol: number,
        folder: string,
        game: string,
        appId: number,
        numplayers: number,
        numbots: number,
        listentype: string,
        environment: string,
        secure: number,
        version: string,
        steamid: string,
        tags: string[]
    },
    date: string,
    maxplayers: number,
    players: Player[],
    bots: Player[],
    connect: string,
    ping: number
}

interface ServerStateReturnable {
    missionName?: string,
    date?: string,
    playerCount?: number,
    players?: string
}

interface ChartReturnable {
    playerCount: number,
    date: string
}

logger.init(getOptions().logLevel, {
    traceWriteFile: true,
    traceFileLocation: 'data/logs/',
    infoFileLocation: 'data/logs/',
    warnFileLocation: 'data/logs/',
    errorFileLocation: 'data/logs/',
})

const app = express()
app.set('view engine', 'ejs');
app.use('/', express.static('public/')) 

logger.trace(`Options: ${JSON.stringify(getOptions())}`, `honeycomb`)

getSquads().then((groups: Group[]) => {
        
    groups.forEach((group: Group) => {

        logger.info(`Creating url "${group.url}"`, `honeycomb`)
        app.get(`/echo-squad`, async (req,res) => {

            getServerLogs().then(dbState => {
                logger.trace('dbState: ' + dbState, `honeycomb/${group.url}`)
        
            var serverLogs: ServerStateReturnable[] = []
            // serverLog types are auto assigned by mongoose
            dbState.forEach( serverLog => {
                serverLogs.unshift(getMissionData(serverLog))
            })
        
            var chartData: ChartReturnable[] = [];
            dbState.forEach(element => {
                
                var temp: ChartReturnable = {
                    date: element.date.split('T')[0],
                    playerCount: element.raw.numplayers  
                };
        
                chartData.unshift(temp)
        
            })
        
            logger.trace('serverLogs: ' + JSON.stringify(serverLogs), `honeycomb/${group.url}`)
            logger.trace('chartData: ' + JSON.stringify(chartData), `honeycomb/${group.url}`)
            
            getSquads().then((groups: Group[]) => {
                
                res.render('index', {
                    serverLogs: serverLogs,
                    groups: groups,
                    chartData: JSON.stringify(chartData)
                })
        
            })
        
            })
        
        })        

    })

})

app.get('/', async (req,res) => {

    getServerLogs().then(dbState => {
        logger.trace('dbState: ' + dbState, 'honeycomb')

    var serverLogs: ServerStateReturnable[] = []
    // serverLog types are auto assigned by mongoose
    dbState.forEach( serverLog => {
        serverLogs.unshift(getMissionData(serverLog))
    })

    var chartData: ChartReturnable[] = [];
    dbState.forEach(element => {
        
        var temp: ChartReturnable = {
            date: element.date.split('T')[0],
            playerCount: element.raw.numplayers  
        };

        chartData.unshift(temp)

    })

    logger.trace('serverLogs: ' + JSON.stringify(serverLogs), 'honeycomb')
    logger.trace('chartData: ' + JSON.stringify(chartData), 'honeycomb')
    
    getSquads().then((groups: Group[]) => {
        
        res.render('index', {
            serverLogs: serverLogs,
            groups: groups,
            chartData: JSON.stringify(chartData)
        })

    })

    })

})

connectToDatabase(() => {

    const port = getOptions().port
    logger.info(`Attempting to start webserver on port ${port}`)
    app.listen(port, () => {
        logger.info(`Successfuly started server on port ${port}`, `honeycomb`)
    })

})

// specific variable makes the function only look for the specified players
function getMissionData(serverLog, specific: string[] = []): ServerStateReturnable {

    const date = serverLog.date.split('T')[0]
    const missionName = serverLog.raw.game
    var players: string[] = [];
    var playersReturn: string;
    
    serverLog.players.forEach((player: Player) => {
        players.push(player.name)
    });

    if (specific.length === 0){
        playersReturn = players.toString().replaceAll(/\s*\[.*?]/g, '')
    } else {
        var toReturn: string[]
        playersReturn = players.toString().replaceAll(/\s*\[.*?]/g, '')
        specific.forEach((player: string) => {
            if(players.includes(player)){
                toReturn.push(player.replaceAll(/\s*\[.*?]/g, ''))
            }
        })
        playersReturn = toReturn.toString()
    }

    const playerCount = playersReturn.split(',').length

    return JSON.parse(`{"missionName": "${missionName}","date": "${date}","playerCount": "${playerCount}","players": "${players}"}`);
}

async function getSquads(): Promise<Group[]> {

    var groups: Group[] = []

    await GroupModel.find().then((groupResponses) => {
        groupResponses.forEach((group) => {
            if (!(groups.toString().includes(group.squad))){
                var temp = {
                    displayName: group.squad, 
                    url: group.squad.toLowerCase().replaceAll(' ', '-')
                }
                groups.push(temp)
            }
        })

    })

    return groups
}

async function getServerLogs() {

    return await ServerState.find()

}

async function connectToDatabase(cb: StartCallback) {

    const uname = getOptions().databaseUsername
    const passwd = getOptions().databasePasswd
    const ip = getOptions().databaseIp
    const final = `mongodb+srv://${uname}:${passwd}@${ip}`

    logger.info(`Attempting to conncet to database`, `honeycomb`)
    await mongoose.connect(final).then(() => {
        logger.info(`Successfuly connected to database`, `honeycomb`)
        cb()
    }).catch((err) => {
        logger.error(`Failed to connect to database`, `honeycomb`)
        logger.error(err.message, `honeycomb`)
    })

}

function getOptions(): Options {
    return JSON.parse(readFileSync('data/honeycomb-options.json', { encoding: 'utf8', flag: 'r' }));
}