export default function formatTime(timeInSeconds){
    if (timeInSeconds) {

        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `0:00`;
};
