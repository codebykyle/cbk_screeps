// this creep is a round-robin approach to upgrading walls based on the average of the room

module.exports = (creep) => {
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
            creep.moveTo(Game.spawns['spawn01']);
            creep.withdraw(Game.spawns['spawn01'], RESOURCE_ENERGY);
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