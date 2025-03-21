const calculateDynamicFare = (distance, demand, traffic, peakHour) => {
    const baseFare = 50; // Base amount in INR
    const perKmRate = 12; // Standard rate per KM
    let surgeMultiplier = 1; // Default no surge

    // 🚦 **Traffic-Based Pricing**
    if (traffic > 7) surgeMultiplier += 0.3; // If heavy traffic, add 30%
    
    // 🔥 **Demand-Based Surge Pricing**
    if (demand > 80) surgeMultiplier += 0.5; // High demand = 50% extra  

    // 🕒 **Peak Hour Pricing (Morning 8-10 AM, Evening 6-9 PM)**
    if (peakHour) surgeMultiplier += 0.4;

    // 📌 **Total Fare Calculation**
    const totalFare = (baseFare + (perKmRate * distance)) * surgeMultiplier;
    
    return { totalFare: Math.round(totalFare), surgeMultiplier };
};

module.exports = calculateDynamicFare;
