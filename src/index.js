import { extractLaunchParams, handleLaunch } from './utils';

function main() {
    handleLaunch(extractLaunchParams());

    // Add Listener to button "1" on Remote to Reload App
    window.addEventListener('keydown', (event) => {
        if (event.keyCode === 49 || event.key === '1') {
            window.location.reload();
            event.preventDefault();
        }
    });
}

main();
