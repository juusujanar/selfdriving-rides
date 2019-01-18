export function getCarSelection(rides, drivers) {
    let selection = {};
    let ridesAssigned = 0;
    const driversCount = drivers.length;
    const ridesCount = rides.length;

    // assign one first ride for each car
    for (let i = 0; i<drivers.length; i++) {
        selection[i] = [ridesAssigned];
        ridesAssigned++;
    }

    while (ridesAssigned < ridesCount) {
        let nextRides = rides.slice(ridesAssigned, Math.min(ridesCount, ridesAssigned + driversCount));
        let driver = assignDriverForNextRide(drivers, nextRides);
        selection[driver].push(ridesAssigned);
        ridesAssigned++;
    }

    return selection;
}

function assignDriverForNextRide(drivers, nextRides) { //todo
    return 0
}


