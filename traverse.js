document.getElementById('numLines').addEventListener('change', createInputFields);

function createInputFields() {
    const numLines = document.getElementById('numLines').value;
    const inputDiv = document.getElementById('traverseInputs');
    inputDiv.innerHTML = '';

    for (let i = 1; i <= numLines; i++) {
        inputDiv.innerHTML += `
            <label for="bearing${i}">Bearing ${i} (degrees):</label>
            <input type="number" id="bearing${i}" name="bearing${i}" step="0.01" min="0" max="360" required>
            
            <label for="distance${i}">Distance ${i} (meters):</label>
            <input type="number" id="distance${i}" name="distance${i}" step="0.01" required><br><br>
        `;
    }
}

function computeTraverse() {
    const numLines = parseInt(document.getElementById('numLines').value);
    let initialEasting = parseFloat(document.getElementById('easting').value);
    let initialNorthing = parseFloat(document.getElementById('northing').value);

    let currentEasting = initialEasting;
    let currentNorthing = initialNorthing;
    let cumulativeDistance = 0;
    let tableBody = document.getElementById('tableBody');
    let totalArea = 0;

    tableBody.innerHTML = '';

    let deltaEastTotal = 0;
    let deltaNorthTotal = 0;

    for (let i = 1; i <= numLines; i++) {
        let bearing = parseFloat(document.getElementById(`bearing${i}`).value);
        let distance = parseFloat(document.getElementById(`distance${i}`).value);

        let bearingRad = (bearing * Math.PI) / 180;
        let deltaE = distance * Math.sin(bearingRad);
        let deltaN = distance * Math.cos(bearingRad);

        currentEasting += deltaE;
        currentNorthing += deltaN;
        cumulativeDistance += distance;

        deltaEastTotal += deltaE;
        deltaNorthTotal += deltaN;

        totalArea += (initialEasting * currentNorthing - currentEasting * initialNorthing) / 2;

        let row = `
            <tr>
                <td>${i}</td>
                <td>${bearing.toFixed(2)}</td>
                <td>${distance.toFixed(2)}</td>
                <td>${deltaE.toFixed(2)}</td>
                <td>${deltaN.toFixed(2)}</td>
                <td>${currentEasting.toFixed(2)}</td>
                <td>${currentNorthing.toFixed(2)}</td>
                <td>${cumulativeDistance.toFixed(2)}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    }

    // Misclosure Calculation
    let closureError = Math.sqrt(Math.pow(deltaEastTotal, 2) + Math.pow(deltaNorthTotal, 2));
    let errorWarning = document.getElementById('error-warning');

    if (closureError > 0.01) { // Assuming an arbitrary error tolerance
        errorWarning.innerHTML = `Warning: Closure error exceeds the acceptable tolerance! Error = ${closureError.toFixed(3)}m`;
    } else {
        errorWarning.innerHTML = '';
    }

    // Total area calculation
    tableBody.innerHTML += `
        <tr>
            <td colspan="5"><strong>Total Area:</strong></td>
            <td colspan="3"><strong>${Math.abs(totalArea.toFixed(2))} square meters</strong></td>
        </tr>
    `;
}
