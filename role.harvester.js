let energyManager = require('global.energyManager');

module.exports = (creep) => {
    let depositor = energyManager();
    return {
        hasSpace() {
            return creep.carry.energy < creep.carryCapacity;
        },

        doHarvest() {
            let sources = creep.room.find(FIND_SOURCES);

            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        },

        depositEnergy() {
            depositor.depositEnergy(creep, depositor.PRIORITIES.SPAWN);
        },

        run() {
            if (this.hasSpace()) {
                this.doHarvest();
            } else {
                this.depositEnergy();
            }
        }
    }
};