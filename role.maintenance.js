module.exports = (creep) => {
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

        depositToStorage() {
            if (creep.transfer(Game.spawns['spawn01'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                console.log('Depositing to storage');
                creep.moveTo(Game.spawns['spawn01']);
            }
        },

        needEnergy() {
            return creep.carry.energy === 0;
        },

        doGetEnergy() {
            creep.moveTo(Game.spawns['spawn01']);
            creep.withdraw(Game.spawns['spawn01'], RESOURCE_ENERGY);
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