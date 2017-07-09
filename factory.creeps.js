

module.exports = () => {

    let getBalancedBodyParts = (energy) => {
        let bodyParts = [];
        let tmpEnergy = energy;

        while (tmpEnergy > 0) {
            if (tmpEnergy > 0 && tmpEnergy >= BODYPART_COST.work) {
                bodyParts.push(WORK);
                tmpEnergy -= BODYPART_COST.work;
            }

            if (tmpEnergy > 0 && tmpEnergy >= BODYPART_COST.move) {
                bodyParts.push(MOVE);
                tmpEnergy -= BODYPART_COST.move;
            }

            if (tmpEnergy > 0 && tmpEnergy >= BODYPART_COST.carry) {
                bodyParts.push(CARRY);
                tmpEnergy -= BODYPART_COST.carry;
            }
        }

        console.log(JSON.stringify(bodyParts));

        return bodyParts;
    };

    let getAttackerBodyParts = (energy) => {
        let bodyParts = [];
        let tmpEnergy = energy;

        while(tmpEnergy > 0) {
            if (tmpEnergy > 0 && tmpEnergy >= BODYPART_COST.move) {
                bodyParts.push(MOVE);
                tmpEnergy -= BODYPART_COST.move;
            }

            if (tmpEnergy > 0 && tmpEnergy >= BODYPART_COST.attack) {
                bodyParts.push(ATTACK);
                tmpEnergy -= BODYPART_COST.attack;
            }

            if (tmpEnergy > 0 && tmpEnergy >= BODYPART_COST.tough) {
                bodyParts.push(TOUGH);
                tmpEnergy -= BODYPART_COST.tough;
            }
        }

        return bodyParts;
    };

    let getMaxCapacity = () => {
        return Game.spawns['spawn01'].room.energyCapacityAvailable;
    };

    return {
        attackerCreep() {
            return Game.spawns['spawn01'].createCreep(getAttackerBodyParts(getMaxCapacity()), null, {
                role: 'attacker'
            });
        },

        workerCreep() {
            return Game.spawns['spawn01'].createCreep(getBalancedBodyParts(getMaxCapacity()), null, {
                role: 'worker',
            });
        },

        harvesterCreep() {
            return Game.spawns['spawn01'].createCreep(getBalancedBodyParts(getMaxCapacity()), null, {
                role: 'harvester',
            });
        },

        maintenanceCreep() {
            return Game.spawns['spawn01'].createCreep(getBalancedBodyParts(getMaxCapacity()), null, {
                role: 'maintenance',
            });
        },

        remoteHarvesterEastCreep() {
            return Game.spawns['spawn01'].createCreep(getBalancedBodyParts(getMaxCapacity()), null, {
                role: 'remoteHarvesterEast',
            });
        },

        remoteHarvesterNorthCreep() {
            return Game.spawns['spawn01'].createCreep(getBalancedBodyParts(getMaxCapacity()), null, {
                role: 'remoteHarvesterNorth',
            });
        },

        wallUpgraderCreep() {
            return Game.spawns['spawn01'].createCreep([WORK, CARRY, MOVE], null, {
                role: 'wallUpgrader'
            });
        }
    }
};