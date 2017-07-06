let config = require('config');
let energyManager = require('global.energyManager');

module.exports = (creep) => {
    let depositor = energyManager();


    return {
        inTargetRoom() {
            return creep.room.name === config.REMOTE_HARVEST_ROOM;
        },

        inHomeRoom() {
            return creep.room.name === config.HOME_ROOM;
        },

        moveToTargetRoom() {
            let exit = creep.room.findExitTo(config.REMOTE_HARVEST_ROOM);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        },

        moveToHomeRoom() {
            let exit = creep.room.findExitTo(config.HOME_ROOM);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        },

        hasInventorySpace() {
            return creep.carry.energy < creep.carryCapacity;
        },

        depositEnergy(){
            depositor.depositEnergy(creep, depositor.PRIORITIES.STORAGE);
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
                    this.depositEnergy();
                }
            }
        },
    }
};