let energyManager = require('global.energyManager');

module.exports = (creep) => {
    let depositor = energyManager();

    return {
        getWallAverage() {
            let walls = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_WALL
            });

            return _.sum(walls, 'hits') / walls.length;
        },

        findNearestLowestWall() {
            return creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_WALL && s.hits <= this.getWallAverage()
            });
        },

        needEnergy() {
            return creep.carry.energy === 0;
        },

        doGetEnergy() {
            depositor.getEnergy(creep, depositor.PRIORITIES.STORAGE_ONLY)
        },

        upgradeWall(wall) {
            if(creep.repair(wall) === ERR_NOT_IN_RANGE) {
                creep.moveTo(wall);
            }
        },

        run() {
            if (this.needEnergy()) {
                this.doGetEnergy();
            } else {
                let wallToUpgrade = this.findNearestLowestWall();

                if (wallToUpgrade) {
                    this.upgradeWall(wallToUpgrade);
                }
            }

        }
    }
};