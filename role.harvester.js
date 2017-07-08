let energyManager = require('global.energyManager');

module.exports = (creep) => {
    let depositor = energyManager();
    return {

        setIsWorking(value) {
            creep.memory.isWorking = value;
        },

        getIsWorking() {
          return creep.memory.isWorking;
        },

        isInventoryFull() {
            return creep.carry.energy === creep.carryCapacity;
        },

        isInventoryEmpty() {
            return creep.carry.energy === 0;
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
            if (this.isInventoryFull()) {
                this.setIsWorking(false);
            } else if(this.isInventoryEmpty()) {
                this.setIsWorking(true);
            }

            if (this.getIsWorking()) {
                this.doHarvest();
            } else {
                this.depositEnergy();
            }
        }
    }
};