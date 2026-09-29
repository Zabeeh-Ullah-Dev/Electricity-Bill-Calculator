const SLABS = [
    { limit: 100, rate: 10 },
    { limit: 100, rate: 20 },
    { limit: Infinity, rate: 30 },
];

const form = document.getElementById("billForm");
const unitsInput = document.getElementById("units");
const errorMessage = document.getElementById("error");
const result = document.getElementById("result");
const displayUnits = document.getElementById("displayUnits");
const displayRate = document.getElementById("displayRate");
const totalAmount = document.getElementById("totalAmount");
const unitFormatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
});
const amountFormatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const units = unitsInput.valueAsNumber;
    if (!Number.isFinite(units) || units < 0) {
        errorMessage.classList.add("visible");
        result.classList.remove("visible");
        unitsInput.setAttribute("aria-invalid", "true");
        return;
    }

    errorMessage.classList.remove("visible");
    unitsInput.removeAttribute("aria-invalid");

    let remainingUnits = units;
    let total = 0;
    const breakdown = SLABS.flatMap(({ limit, rate }) => {
        const slabUnits = Math.min(remainingUnits, limit);
        remainingUnits -= slabUnits;

        if (slabUnits === 0) {
            return [];
        }

        total += slabUnits * rate;
        return `${unitFormatter.format(slabUnits)} × Rs. ${rate}`;
    });

    displayUnits.textContent = unitFormatter.format(units);
    displayRate.textContent = breakdown.length > 0
        ? breakdown.join(" + ")
        : "No units billed";
    totalAmount.textContent = amountFormatter.format(total);
    result.classList.add("visible");
});