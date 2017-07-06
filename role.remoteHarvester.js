let config = require('config');

module.exports = (creep) => {
    return {
        inTargetRoom() {
            return creep.room.name === config.REMOTE_HARVEST_ROOM;
        },

        inHomeRoom() {
            return creep.room.name === config.HOME_ROOM;
        },

        moveToTargetRoom() {
            let exit = creep.room.findExitTo(config.REMOTE_HARVEST_ROOM);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        },

        moveToHomeRoom() {
            let exit = creep.room.findExitTo(config.HOME_ROOM);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        },

        hasInventorySpace() {
            return creep.carry.energy < creep.carryCapacity;
        },

        canTransferToSpawn() {
            return Game.spawns['spawn01'].energy < Game.spawns['spawn01'].energyCapacity;
        },

        depositToSpawn() {
            if (creep.transfer(Game.spawns['spawn01'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['spawn01']);
            }
        },

        depositToExtension() {
            let expansion = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter:(structure) => {
                    return  (structure.structureType === STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity
                }
            });


            if (expansion) {
                let depositResponse = creep.transfer(expansion, RESOURCE_ENERGY);

                if (depositResponse === ERR_NOT_IN_RANGE || depositResponse === -8) {
                    creep.moveTo(expansion);
                }
            }
        },

        doHarvest() {
            let source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        },


        run() {
            if (this.hasInventorySpace()) {
                if (this.inTargetRoom()) {
                    this.doHarvest();
                } else {
                    this.moveToTargetRoom();
                }
            } else {
                if (!this.inHomeRoom()) {
                    this.moveToHomeRoom();
                } else {
                    if (this.canTransferToSpawn()) {
                        this.depositToSpawn();
                    } else if (!this.canTransferToSpawn()) {
                        this.depositToExtension();
                    }
                }
            }
        },
    }
};