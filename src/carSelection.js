export function getCarSelection(rides, drivers) {
    //console.log(drivers);
    //selection key is drive id and value ride number (id)
    let selection = {};
    let ridesAssigned = 0;

    // assign one first ride for each car
    for (let i = 0; i<drivers.length; i++) {
        selection[i] = [ridesAssigned];
        ridesAssigned++;
    }

    dummySolution(selection, ridesAssigned, rides.length);

    return selection;
}

function dummySolution(selection, ridesAssigned, ridesCount) {
    const count = ridesCount - ridesAssigned;
    for (let i = 0; i < count; i++) {
        selection[0].push(ridesAssigned);
        ridesAssigned++;
    }
}
