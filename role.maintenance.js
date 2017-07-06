let energyManager = require('global.energyManager');

module.exports = (creep) => {
    let depositor = energyManager();

    return {
        hasInventorySpace() {
            let usedSpace = _.sum(creep.carry);
            return usedSpace < creep.carryCapacity;
        },

        findDroppedResource() {
            return creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        },

        findRepairTarget() {
            return creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
            })
        },

        repairStructure(structure) {
            if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                creep.moveTo(structure);
            }
        },

        getDroppedResource(droppedResource) {
            if (creep.pickup(droppedResource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedResource);
            }
        },

        needEnergy() {
            return creep.carry.energy === 0;
        },

        doGetEnergy() {
            depositor.getEnergy(creep, depositor.PRIORITIES.SPAWN);
        },

        depositToStorage() {
            depositor.depositEnergy(creep, depositor.PRIORITIES.SPAWN);
        },

        run() {
            let droppedResource = this.findDroppedResource();
            let repairStructure = this.findRepairTarget();


            // If there are dropped resources, grab them
            // Otherwise repair broken structures
            if (droppedResource) {
                if (this.hasInventorySpace()) {
                    this.getDroppedResource(droppedResource);
                } else {
                    this.depositToStorage();
                }
            } else if (repairStructure) {
                if (this.needEnergy()) {
                    this.doGetEnergy();
                } else {
                    this.repairStructure(repairStructure);
                }
            }
        }
    }
};