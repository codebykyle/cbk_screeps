let config = require('config');


module.exports = (creep) => {
    return {
        isFleeing() {
            return config.IS_FLEEING;
        },

        moveToHomeRoom() {
            let exit = creep.room.findExitTo(config.HOME_ROOM);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        },

        findTarget() {
            console.log('Finding target');

            let nearbyCreeps = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, 1, {
                filter: (i) => i.owner.username !== 'Apogee' && i.owner.username !== 'CodeByKyle'
            });

            if (nearbyCreeps) {
                console.log('attacking creep: ', JSON.stringify(nearbyCreeps.name));
                return nearbyCreeps;
            }

            let nearbyStructure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: (s) => s.structureType !== STRUCTURE_CONTROLLER
            });

            if (nearbyStructure) {
                console.log('attacking structure: ', JSON.stringify(nearbyStructure.structureType));
                return nearbyStructure
            }

            let enemeySpawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS, {
                filter: (s) => true
            });

            if(enemeySpawn) {
                console.log('attacking spawn: ', JSON.stringify(enemeySpawn.structureType));
                return enemeySpawn;
            }

            let constructionSites = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES, {
                filter: (s) => true
            });


            if(constructionSites) {
                console.log('attacking construction site: ', JSON.stringify(constructionSites.structureType));
                return constructionSites;
            }
        },

        inTargetRoom() {
            return creep.room.name === config.ROOM_TO_ATTACK;
        },

        inHomeRoom() {
            return creep.room.name === config.HOME_ROOM;
        },

        moveToHomeroomSpawn() {
            creep.moveTo(Game.spawns['spawn01']);
        },

        moveToTargetRoom() {
            let exit = creep.room.findExitTo(config.ROOM_TO_ATTACK);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        },

        attackTarget(target) {
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        },

        flee() {
            if (!this.inHomeRoom()) {
                this.moveToHomeRoom();
            } else  {
                this.moveToHomeroomSpawn();
            }
        },

        run() {
            if (!config.ROOM_TO_ATTACK) {
                if (!this.inHomeRoom()) {
                    this.moveToHomeRoom();
                } else {
                    let defensiveTarget = this.findTarget();
                    this.attackTarget(defensiveTarget);
                }
                return;
            }

            if (!this.inTargetRoom()) {
                console.log('Not in target room', creep.pos.roomName);

                this.moveToTargetRoom();

            } else {

                console.log('In target room', creep.pos.roomName);

                if (this.isFleeing()) {
                    console.log('Fleeing');

                    this.flee();
                    return;
                }

                let target = this.findTarget();

                if (target) {
                    this.attackTarget(target);
                }
            }
        }
    }
};