export const generateTournamentId = (): number => {
    return Math.floor(Math.random() * 1000000);
};

export const formatAddress = (addr: string) => {
    return `${addr.substring(0, 4) + '...' + addr.substring(addr.length - 3, addr.length)}`;
};
