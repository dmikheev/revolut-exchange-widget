export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
}

export const SymbolByCurrency = {
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.GBP]: '£',
};
