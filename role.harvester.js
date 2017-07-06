module.exports = (creep) => {
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

        canTransferToSpawn() {
            return Game.spawns['spawn01'].energy < Game.spawns['spawn01'].energyCapacity;
        },

        transferToSpawn() {
            if (creep.transfer(Game.spawns['spawn01'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['spawn01']);
            }
        },

        transferToExtension() {
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

        run() {
            if (this.hasSpace()) {
                this.doHarvest();
            } else if (this.canTransferToSpawn()) {
                this.transferToSpawn();
            } else if (!this.canTransferToSpawn()) {
                this.transferToExtension();
            }
        }
    }
};