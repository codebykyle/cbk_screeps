let config = require('config');

let creepCounter = require('global.counter');
let creepFactory = require('factory.creeps');

let roleHarvester = require('role.harvester');
let roleBuilder = require('role.builder');
let roleMaintenance = require('role.maintenance');
let roleRemoteHarvester = require('role.remoteHarvester');
let roleWallUpgrader = require('role.wallUpgrader');
let roleAttacker = require('role.attacker');

module.exports = {
    checkMissionCritical() {
        // There might be a situation where we're not able to create additional harvesters
        // If we are building a lot, and never reach the energy to build an additional harvester to keep everything going
        // stop building and go to harvesting to ensure the chain doesn't stop
        // if (Game.spawns['spawn01'].room.energyAvailable < 300) {
        let CreepCount = creepCounter().refreshData();
        if (CreepCount.getTypeCount('harvester') < config.HARVESTERS_TO_SPAWN - 2) {
            console.log('Mission is critical');
            return true;
        }
        // }

        return false;
    },

    assignCreepRole(creep) {
        switch(creep.memory.role) {
            case 'harvester':
                roleHarvester(creep).run();
                break;
            case 'maintenance':
                roleMaintenance(creep).run();
                break;
            case 'worker':
                roleBuilder(creep).run();
                break;
            case 'remoteHarvesterEast':
                roleRemoteHarvester(creep, config.REMOTE_HARVEST_EAST_ROOM).run();
                break;
            case 'remoteHarvesterNorth':
                roleRemoteHarvester(creep, config.REMOTE_HARVEST_NORTH_ROOM).run();
                break;
            case 'wallUpgrader':
                roleWallUpgrader(creep).run();
                break;
            case 'attacker':
                roleAttacker(creep).run();
                break;
        }
    },

    spawnNeededCreeps() {
        let CreepFactory = creepFactory();
        let CreepCount = creepCounter().refreshData();

        if (CreepCount.getTypeCount('harvester') < config.HARVESTERS_TO_SPAWN) {
            console.log('Spawning harvester creep: ', CreepFactory.harvesterCreep());
        } else if (CreepCount.getTypeCount('worker') < config.WORKERS_TO_SPAWN) {
            console.log('Spawning worker creep: ', CreepFactory.workerCreep());
        } else if (CreepCount.getTypeCount('maintenance') < config.MAINTENANCE_TO_SPAWN) {
            console.log('Spawning maintenance creep: ', CreepFactory.maintenanceCreep());
        } else if (CreepCount.getTypeCount('remoteHarvesterEast') < config.REMOTE_HARVESTER_EAST_TO_SPAWN) {
            console.log('Spawning remote harvester (east) creep: ', CreepFactory.remoteHarvesterEastCreep());
        } else if (CreepCount.getTypeCount('remoteHarvesterEast') < config.REMOTE_HARVESTER_NORTH_TO_SPAWN) {
            console.log('Spawning remote harvester (north) creep: ', CreepFactory.remoteHarvesterNorthCreep());
        } else if (CreepCount.getTypeCount('wallUpgrader') < config.WALL_UPGRADERS_TO_SPAWN) {
            console.log('Spawning wall upgrader creep: ', CreepFactory.wallUpgraderCreep());
        } else if (CreepCount.getTypeCount('attacker') < config.ATTACKERS_TO_SPAWN) {
            console.log('Spawning attacker creep: ', CreepFactory.attackerCreep())
        }
    },

    loop() {
        this.spawnNeededCreeps();

        let isMissionCritical = this.checkMissionCritical();

        Object.keys(Game.creeps).forEach((creepName) => {
            let creep = Game.creeps[creepName];

            if (!isMissionCritical) {
                this.assignCreepRole(creep);
            } else {
                if(creep.memory.role !== 'attacker') {
                    roleHarvester(creep).run();
                } else {
                    this.assignCreepRole(creep)
                }
            }
        })
    },
};
