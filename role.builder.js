let energyManager = require('global.energyManager');

module.exports = (creep) => {
    let depositor = energyManager();

    return {
        needEnergy() {
            return creep.carry.energy === 0;
        },

        doGetEnergy() {
            depositor.getEnergy(creep, depositor.PRIORITIES.STORAGE_ONLY);
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
                // If the controller gets downgraded, keep it at level 2
                if (creep.room.controller.level < 3) {
                    this.upgradeController();
                    return;
                }

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