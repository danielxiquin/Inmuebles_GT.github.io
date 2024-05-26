document.getElementById('building-type').addEventListener('change', function() {
    const selectedBuildingType = this.value;
    const securityOptions = document.getElementById('security-options');
    const petFriendlyOptions = document.getElementById('pet-friendly-options');
    const commercialActivityOptions = document.getElementById('commercial-activity-options');

    if (selectedBuildingType === 'Houses') {
        securityOptions.style.display = 'block';
        petFriendlyOptions.style.display = 'none';
        commercialActivityOptions.style.display = 'none';
    } else if (selectedBuildingType === 'Apartments') {
        securityOptions.style.display = 'none';
        petFriendlyOptions.style.display = 'block';
        commercialActivityOptions.style.display = 'none';
    } else if (selectedBuildingType === 'Premises') {
        securityOptions.style.display = 'none';
        petFriendlyOptions.style.display = 'none';
        commercialActivityOptions.style.display = 'block';
    } else {
        securityOptions.style.display = 'none';
        petFriendlyOptions.style.display = 'none';
        commercialActivityOptions.style.display = 'none';
    }
});