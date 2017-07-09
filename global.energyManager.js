

module.exports = () => {
    let creepDepositEnergy = (creep, structure) => {
        if(creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(structure)
        }
    };

    let creepWithdrawEnergy = (creep, structure) => {
        if (creep.withdraw(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(structure);
        }
    };

    let depositEnergyToSpawn = (creep) => {
        // Try a transfer to the spawn
        let spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
            filter: (spawn) => spawn.energy < spawn.energyCapacity
        });

        if (spawn) {
            creepDepositEnergy(creep, spawn);
            return true;
        }

        // Try a transfer to extension
        let expansion = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter:(structure) => {
                return  (structure.structureType === STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity
            }
        });

        if (expansion) {
            creepDepositEnergy(creep, expansion);
            return true;
        }
        
        return false;
    };

    let depositEnergyToStorage = (creep) => {
        let storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter:(structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) && _.sum(structure.store) < structure.storeCapacity;
            }
        });

        if (storage) {
            creepDepositEnergy(creep, storage);
            return true;
        }
        
        return false;
    };

    let getEnergyFromSpawn = (creep) => {
        // Try a transfer to the spawn
        let spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
            filter: (spawn) => spawn.energy > 0
        });

        if (spawn) {
            creepWithdrawEnergy(creep, spawn);
            return true;
        }

        // Try a transfer to extension
        let expansion = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter:(structure) => {
                return  (structure.structureType === STRUCTURE_EXTENSION) && structure.energy > 0
            }
        });

        if (expansion) {
            creepWithdrawEnergy(creep, expansion);
            return true;
        }

        return false;
    };

    let getEnergyFromStorage = (creep) => {
        let storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter:(structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) && structure.store.hasOwnProperty('energy') && structure.store.energy > 0;
            }
        });

        if (storage) {
            creepWithdrawEnergy(creep, storage);
            return true;
        }

        return false;
    };

    return {
        PRIORITIES: { SPAWN: 1, STORAGE: 2, SPAWN_ONLY: 3, STORAGE_ONLY:4 },

        getEnergy(creep, priority=this.PRIORITIES.SPAWN) {
            switch(priority) {
                case this.PRIORITIES.SPAWN:
                    if (!getEnergyFromSpawn(creep)) { getEnergyFromStorage(creep)}
                    break;
                case this.PRIORITIES.STORAGE:
                    if (!getEnergyFromStorage(creep)) { getEnergyFromSpawn(creep) }
                    break;
                case this.PRIORITIES.STORAGE_ONLY:
                    getEnergyFromStorage(creep);
                    break;
                case this.PRIORITIES.SPAWN_ONLY:
                    getEnergyFromSpawn(creep);
                    break;
                default:
                    if (!getEnergyFromSpawn(creep)) { getEnergyFromStorage(creep) }
                    break;
            }
        },

        depositEnergy(creep, priority=this.PRIORITIES.SPAWN) {
            switch(priority) {
                case this.PRIORITIES.SPAWN:
                    if (!depositEnergyToSpawn(creep)) { depositEnergyToStorage(creep)}
                    break;
                case this.PRIORITIES.STORAGE:
                    if (!depositEnergyToStorage(creep)) { depositEnergyToSpawn(creep) }
                    break;
                case this.PRIORITIES.SPAWN_ONLY:
                    depositEnergyToSpawn(creep);
                    break;
                case this.PRIORITIES.STORAGE_ONLY:
                    depositEnergyToStorage(creep);
                    break;
                default:
                    if (!depositEnergyToSpawn(creep)) { depositEnergyToStorage(creep)}
                    break;
            }
        }
    }
};