module.exports = (creep) => {
    return {
        needEnergy() {
            return creep.carry.energy === 0;
        },

        doGetEnergy() {
            creep.moveTo(Game.spawns['spawn01']);
            creep.withdraw(Game.spawns['spawn01'], RESOURCE_ENERGY);
        },

        findConstructionSite() {
            return creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        },

        doBuild(constructionSite) {
            if(creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSite);
            }
        },

        upgradeController() {
            if (creep.room.controller) {
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        },

        run() {
            if (this.needEnergy()) {
                // If we need energy, get energy
                this.doGetEnergy();
            } else {
                // If there is a construction site, build it, otherwise, upgrade the controller
                let constructionSite = this.findConstructionSite();

                if(constructionSite) {
                    this.doBuild(constructionSite);
                } else {
                    this.upgradeController();
                }
            }
        }
    };
};