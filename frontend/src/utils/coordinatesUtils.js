
export const getParksCenter = (parks) => {
    if (!parks || parks.length === 0) return [0, 0];

    const total = parks.reduce(
        (acc, p) => {
            acc.lat += p.lat;
            acc.lon += p.lon;
            return acc;
        },
        { lat: 0, lon: 0 }
    );

    const centerLat = total.lat / parks.length;
    const centerLon = total.lon / parks.length;

    return [centerLat, centerLon];
};
