

module.exports = () => {
    return {
        workerCreep() {
            Game.spawns['spawn01'].createCreep([WORK, WORK, MOVE, CARRY], null, {
                role: 'worker',
            });
        },

        harvesterCreep() {
            Game.spawns['spawn01'].createCreep([WORK, WORK, MOVE, CARRY], null, {
                role: 'harvester',
            });
        },

        maintenanceCreep() {
            Game.spawns['spawn01'].createCreep([WORK, WORK, MOVE, CARRY], null, {
                role: 'maintenance',
            });
        }
    }
};