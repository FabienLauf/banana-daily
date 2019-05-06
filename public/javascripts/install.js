let deferredInstallPrompt = null;
const installButton = document.getElementById('butInstall');
installButton.addEventListener('click', installPWA);

function installPWA() {
    // hide the install button
    installButton.setAttribute('hidden', true);
    // Show the prompt
    deferredInstallPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredInstallPrompt.userChoice
        .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the installation prompt');
            } else {
                console.log('User dismissed the installation prompt');
            }
            deferredPrompt = null;
        });

}

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredInstallPrompt = e;
    // Update UI notify the user they can add to home screen
    installButton.removeAttribute('hidden');
});
